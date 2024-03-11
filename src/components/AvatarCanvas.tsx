import { Environment, Html, useAnimations, useGLTF } from '@react-three/drei'
import { Suspense, useEffect, useLayoutEffect, useState } from 'react'
import { MyLoader } from './MyLoader'
import { Group } from 'three';

const Avatar: React.FC = () => {
	const [url, setUrl] = useState<string>('/praying.glb')
	const avatar = useGLTF(url)
	const [index, setIndex] = useState<number>(1)
	const { actions, names } = useAnimations(avatar.animations, avatar.scene)
	const [isClicked, setClicked] = useState<boolean>(false)

	useEffect(() => {
		const actionName = names[index];
		const action = actions[actionName];
		action?.reset().fadeIn(0.5).play();
		return () => {
			action?.fadeOut(0.5);
		};
	}, [index, actions, names]);

	useLayoutEffect(() => {
		Object.values(avatar.nodes).forEach((node) => {
			if (node) {
				node.receiveShadow = node.castShadow = true;
			}
		});
	}, [avatar.nodes, avatar.materials]);

	return (
		<group>
			<primitive
				object={avatar.scene as unknown as Group}
				rotation={[0, 2, 0]}
				position={[-3, -0.39, 0.2]}
			/>
			<Html>
				<button
					className='counter-button'
					onClick={() => {
						setIndex((index + 1) % names.length)
						setClicked(!isClicked)
					}}
				>
					Click me
				</button>
			</Html>
		</group>
	)
}

export default function AvatarCanvas(): JSX.Element {
	return (
		<Suspense fallback={<MyLoader />}>
			<Avatar />
			<Environment preset='sunset' background={false} />
		</Suspense>
	)
}
