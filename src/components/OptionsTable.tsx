import React, { useState } from 'react'
import { DEFAULT_OPTIONS, OPTION_DICTIONARY, options, setOption, setOptions, storage } from '../lib/declarations'
import { determineInputType } from '../lib/utils'
import { PolyDictionary } from '../lib/definitions'
import { resetOptions } from '../lib/ResetDefaults'

interface Props
{
  optionsState: PolyDictionary
  setOptionsState: ( options: ( previousState: PolyDictionary ) => PolyDictionary ) => void
}

const TYPES_THAT_USE_ON_CHANGE = [ "checkbox", "range" ]

export default function OptionsTable( { optionsState, setOptionsState }: Props ) {
  // this only exists to rerender on change

  function handleResetOptionsClick()
  {
    setOptionsState( () => {
      resetOptions()
      return options
    } )
  }

  function handleOptionChange( e: any, option: string )
  {
    if ( optionsState === null ) return

    const target = e.target as HTMLInputElement 
    let value: any = target.value

    // this may need changed depending on different input types
    if ( target.type === "checkbox" )          value = target.checked
    else if ( !isNaN( target.valueAsNumber ) ) value = target.valueAsNumber

    if ( value === null ) return console.warn( `[BYS] :: Option set handler tried to set option ${option} to null` )

    // if value is number, handle min and max ranges
    if ( [ "number", "range" ].includes( target.type ) )
    {
      if ( target?.max !== "" )
        if ( +value > +target.max ) 
          value = +target.max
        
      if ( target?.min !== "" )
        if ( +value < +target.min ) 
          value = +target.min
    }
    
    // set in storage
    setOptionsState( () => {
      const newState = setOption( optionsState, option, value )

      storage.set( { "extraopts" : newState } )
      localStorage.setItem( "yt-extraopts", JSON.stringify( newState ) )
      
      console.log( `[BYS] :: Set Option "${option}" to ${value}` )

      return newState
    } )

  }

  function populateOptionsTable()
  {
    return Object.entries( optionsState as Object ).map( ( [option, value] ) => {
      if ( OPTION_DICTIONARY === null ) return <></>

      const type = determineInputType( value )

      if ( optionsState === null ) return

      return (
        <div key={crypto.randomUUID()} className="extra_options--row">
          <label htmlFor={`option_input_${option}`}>{ (OPTION_DICTIONARY !== null ) ? "" + OPTION_DICTIONARY[ option ]?.desc : option }</label>
          <input 
            id={`extra_options_${option}`} 
            type={ OPTION_DICTIONARY[ option ]?.type ?? determineInputType( value ) } 
            name={`option_input_${option}`} 

            min={ OPTION_DICTIONARY[ option ]?.min ?? null }
            max={ OPTION_DICTIONARY[ option ]?.max ?? null }

            value={   OPTION_DICTIONARY[ option ]?.type !== "checkbox" ? optionsState[ option ] : undefined }
            checked={ OPTION_DICTIONARY[ option ]?.type === "checkbox" ? optionsState[ option ] : undefined }

            onChange ={ (  TYPES_THAT_USE_ON_CHANGE.includes( type ) ) ? e => handleOptionChange( e, option ) : undefined }
            onInput = { ( !TYPES_THAT_USE_ON_CHANGE.includes( type ) ) ? e => handleOptionChange( e, option ) : undefined }
          />
        </div>
    )
    } )
  }

  return (
    <>
      <h3 className="prevent-selection popup_subheading">Extra Options</h3>

      <div id="extra_options">
        { populateOptionsTable() }
      </div>

      <footer className="--footer-button-container">
        <button onClick={ handleResetOptionsClick } className="--footer-button">Reset Options</button>
        <a href="https://github.com/ynshung/better-yt-shorts" target="_blank">
          <span className="--global-footer-link">Github</span>
        </a>
      </footer>
    </>
  )
}
