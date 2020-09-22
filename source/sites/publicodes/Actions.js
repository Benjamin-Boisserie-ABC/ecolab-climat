import React, { useEffect } from 'react'
import { useParams } from 'react-router'
import emoji from 'react-easy-emoji'
import tinygradient from 'tinygradient'
import { animated, useSpring, config } from 'react-spring'
import ShareButton from 'Components/ShareButton'
import { findContrastedTextColor } from 'Components/utils/colors'
import { motion } from 'framer-motion'

import BallonGES from './images/ballonGES.svg'
import SessionBar from 'Components/SessionBar'
import { Link } from 'react-router-dom'
import { humanWeight } from './HumanWeight'
import {
	flatRulesSelector,
	analysisWithDefaultsSelector,
} from 'Selectors/analyseSelectors'
import { useDispatch, useSelector } from 'react-redux'
import { setSimulationConfig } from 'Actions/actions'

const gradient = tinygradient(['#0000ff', '#ff0000']),
	colors = gradient.rgb(20)

export default ({}) => {
	const { score } = useParams()
	const { value } = useSpring({
		config: { mass: 1, tension: 150, friction: 150, precision: 1000 },
		value: +score,
		from: { value: 0 },
	})

	const config = {
		objectifs: ["arrêter l'avion"],
	}
	const analysis = useSelector(analysisWithDefaultsSelector)
	const configSet = useSelector((state) => state.simulation?.config)

	const dispatch = useDispatch()
	useEffect(() => dispatch(setSimulationConfig(config)), [])
	if (!configSet) return null
	console.log(analysis)

	return <AnimatedDiv value={value} score={score} analysis={analysis} />
}

const AnimatedDiv = animated(({ analysis, score, value }) => {
	return (
		<div css="padding: 0 .3rem 1rem; max-width: 600px; margin: 0 auto;">
			<h1 css="margin: 0;font-size: 160%">Comment réduire mon empreinte ?</h1>
			<Action
				color1={'#e58e26'}
				color2={'#d0b105'}
				icônes="🍽🍖"
				titre="Diviser ma consommation de viande par 4"
				empreinte={'-1 tonne'}
				nom={'viande'}
			/>
			<Action
				color1={'#ff0000'}
				color2={'#ff1166'}
				icônes="🍽🍖"
				titre="Arrêter l'avion"
				empreinte={(analysis.targets[0].nodeValue / 1000).toFixed(1) + ' tonne'}
				nom={'avion'}
			/>
			<Action
				color1={'#04a4ac'}
				color2={'#05569d'}
				icônes={'🏠📺'}
				titre="Éteindre mes appareils en veille"
				empreinte={'-33 kg'}
			/>
		</div>
	)
})

const Action = ({ nom, icônes, color1, color2, titre, empreinte }) => (
	<Link css="text-decoration: none; width: 100%" to={'/actions/' + nom}>
		<motion.div
			animate={{ scale: [0.85, 1] }}
			transition={{ duration: 0.2, ease: 'easeIn' }}
			className=""
			css={`
				background: linear-gradient(180deg, ${color1} 0%, ${color2} 100%);
				color: white;
				margin: 1rem auto;
				border-radius: 0.6rem;
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 0.6rem;

				text-align: center;
				font-size: 100%;
				h2 {
					color: white;
					font-size: 120%;
					font-weight: normal;
					margin: 1rem;
				}
				> h2 > span > img {
					margin-right: 0.4rem !important;
				}
			`}
		>
			<h2>
				<span>{emoji(icônes)}</span>
				{titre}
			</h2>
			<div
				css={`
					background: white;
					color: var(--color);
					border-radius: 1rem;
					padding: 0.6rem;
					margin-bottom: 0.6rem;
				`}
			>
				<span css="font-size: 200%">{empreinte}</span> de CO₂e par an
			</div>
		</motion.div>
	</Link>
)
