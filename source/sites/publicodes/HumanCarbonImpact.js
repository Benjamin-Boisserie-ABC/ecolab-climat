import scenarios from './scenarios.yaml'
import * as chrono from './chrono'
import { mapObjIndexed, toPairs } from 'ramda'
import React from 'react'
import emoji from 'react-easy-emoji'
import { Link } from 'react-router-dom'
import CarbonImpact from './CarbonImpact'

let limitPerPeriod = scenario =>
	mapObjIndexed(
		v => v * scenarios[scenario]['crédit carbone par personne'] * 1000,
		{
			...chrono,
			négligeable: 0
		}
	)

let findPeriod = (scenario, nodeValue) =>
	toPairs(limitPerPeriod(scenario)).find(
		([, limit]) => limit <= Math.abs(nodeValue)
	)

let humanCarbonImpactData = (scenario, nodeValue) => {
	let [closestPeriod, closestPeriodValue] = findPeriod(scenario, nodeValue),
		factor = Math.round(nodeValue / closestPeriodValue),
		closestPeriodLabel = closestPeriod.startsWith('demi')
			? closestPeriod.replace('demi', 'demi-')
			: closestPeriod

	return { closestPeriod, closestPeriodValue, closestPeriodLabel, factor }
}

export default ({ scenario, nodeValue, formule, showCarbon, dottedName }) => {
	let { closestPeriodLabel, closestPeriod, factor } = humanCarbonImpactData(
		scenario,
		nodeValue
	)
	return (
		<div
			css={`
				border-radius: 6px;
				background: var(--colour);
				padding: 1em;
				margin: 0 auto;
				color: var(--textColour);
			`}>
			{closestPeriodLabel === 'négligeable' ? (
				<span>Impact négligeable {emoji('😎')}</span>
			) : (
				<>
					<div
						css={`
							font-size: 220%;
							margin-bottom: 0.25rem;
						`}>
						{factor +
							' ' +
							closestPeriodLabel +
							(closestPeriod[closestPeriod.length - 1] !== 's' &&
							Math.abs(factor) > 1
								? 's'
								: '')}
					</div>
					de&nbsp;
					<Link css="color: inherit" to="/scénarios">
						crédit carbone personnel
					</Link>
				</>
			)}
			{showCarbon && <CarbonImpact {...{ nodeValue, formule, dottedName }} />}
		</div>
	)
}
