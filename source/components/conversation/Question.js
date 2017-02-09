import React, {Component} from 'react'
import {connect} from 'react-redux'
import {FormDecorator} from './FormDecorator'
import {answer, answered} from './userAnswerButtonStyle'
import HoverDecorator from '../HoverDecorator'
import Term from './Term'
import {EXPLAIN_TERM} from '../../actions'

@connect(null, dispatch => ({
	explainTerm: term => () => dispatch({type: EXPLAIN_TERM, term})
}))
@HoverDecorator
class RadioLabel extends Component {

	render() {
		let {choice: {value, label}, input, submit, hover, themeColours, explainTerm} = this.props,
			labelStyle =
				Object.assign(
					(value === input.value || hover) ? answered(themeColours) : answer(themeColours),
				)

		return (
			<label
				style={labelStyle}
				className="radio" >
				<input
					type="radio" {...input} onClick={submit}
					value={value} checked={value === input.value ? 'checked' : ''} />
				<Term label={label} defined={true} explain={explainTerm(value)}/>
			</label>
		)
	}
}

/* Ceci est une saisie de type "radio" : l'utilisateur choisit une réponse dans une liste.
FormDecorator permet de factoriser du code partagé par les différents types de saisie,
dont Question est un example */
@FormDecorator('question')
export default class Question extends Component {
	render() {
		let {
			input,
			stepProps: {submit, choices},
			themeColours
		} = this.props

		return (
			<span>
				{ choices.map((choice) =>
						<RadioLabel key={choice.value} {...{choice, input, submit, themeColours}}/>
				)}
			</span>
		)
	}
}