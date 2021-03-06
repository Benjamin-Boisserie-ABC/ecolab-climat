import { T } from 'Components'
import React, { useEffect, useState } from 'react'
import Worker from 'worker-loader!./SelectTauxRisque.worker.js'
import { FormDecorator } from '../FormDecorator'
const worker = new Worker()

function SelectComponent({ setFormValue, submit, options }) {
	const [searchResults, setSearchResults] = useState()
	let submitOnChange = option => {
		option.text = +option['Taux net'].replace(',', '.')
		setFormValue(option.text)
		submit()
	}
	useEffect(() => {
		worker.postMessage({
			options
		})

		worker.onmessage = ({ data: results }) => setSearchResults(results)
	}, [])

	return (
		<>
			<input
				type="search"
				css={`
					padding: 0.4rem;
					margin: 0.2rem 0;
					width: 100%;
					border: 1px solid var(--lighterTextColor);
					border-radius: 0.3rem;
					color: inherit;
					font-size: inherit;
					transition: border-color 0.1s;
					position: relative;

					:focus {
						border-color: var(--color);
					}
				`}
				placeholder="Saisissez votre domaine d'activité"
				onChange={e => {
					let input = e.target.value
					if (input.length < 2) {
						setSearchResults(undefined)
						return
					}
					worker.postMessage({ input })
				}}
			/>
			{searchResults && searchResults.length === 0 && (
				<p>
					<T>Aucun résultat</T>
				</p>
			)}

			{searchResults &&
				searchResults.map(option => (
					<div
						key={JSON.stringify(option)}
						css={`
							text-align: left;
							width: 100%;
							padding: 0 0.4rem;
							border-radius: 0.3rem;
							display: flex;
							align-items: center;
							cursor: pointer;
							:hover,
							:focus {
								background-color: var(--lighterColor);
							}
							background: white;
							border-radius: 0.6rem;
							margin-top: 0.4rem;
							span {
								display: inline-block;
								margin: 0.6rem;
							}
						`}
						onClick={() => submitOnChange(option)}
					>
						<span
							css={`
								width: 65%;
								font-size: 85%;
							`}
						>
							{option['Nature du risque']}
						</span>

						<span
							css={`
								width: 10%;
								min-width: 3em;
								color: #333;
							`}
						>
							<span>{option['Taux net'] + ' %'}</span>
						</span>
						<span
							css={`
								width: 20%;
								font-size: 85%;
								background-color: #ddd;
								color: #333;
								border-radius: 0.25em;
								padding: 0.5em;
								text-align: center;
							`}
						>
							{option['Catégorie']}
						</span>
					</div>
				))}
			{/*
		<ReactSelect
			options={options}
			onChange={submitOnChange}
			labelKey="Nature du risque"
			valueKey="Code risque"
			placeholder="Tapez des mots ou déroulez la liste complète"
			optionRenderer={SelectOption}
			valueRenderer={value => value['Taux net']}
			clearable={false}
			value={selectValue}
		/>
				*/}
		</>
	)
}

export default FormDecorator('select')(function Select(props) {
	const [options, setOptions] = useState(null)
	useEffect(() => {
		fetch(
			'https://raw.githubusercontent.com/betagouv/taux-collectifs-cotisation-atmp/master/taux-2019.json'
		)
			.then(response => {
				if (!response.ok) {
					let error = new Error(response.statusText)
					error.response = response
					throw error
				}
				return response.json()
			})
			.then(json => setOptions(json))
			.catch(
				error =>
					console.log('Erreur dans la récupération des codes risques', error) // eslint-disable-line no-console
			)
	}, [])

	if (!options) return null
	return <SelectComponent {...props} options={options} />
})
