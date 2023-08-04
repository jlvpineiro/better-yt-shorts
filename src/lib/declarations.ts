import BROWSER from "../background/browser";
import { DefaultsDictionary, NumberDictionary, OptionsDictionary, PolyDictionary, StateObject, StringDictionary } from "./definitions";

export const VERSION = BROWSER.runtime.getManifest().version

export const DEFAULT_KEYBINDS: DefaultsDictionary = {
  "Seek Backward":   "ArrowLeft",
  "Seek Forward":    "ArrowRight",
  "Decrease Speed":  "KeyU",
  "Reset Speed":     "KeyI",
  "Increase Speed":  "KeyO",
  "Decrease Volume": "Minus",
  "Increase Volume": "Equal",
  "Toggle Mute":     "KeyM",
  "Next Frame":      "Comma",
  "Previous Frame":  "Period",
  "Next Short":      "KeyS", 
  "Previous Short":  "KeyW",
};

export const DEFAULT_OPTIONS: DefaultsDictionary = {
  // add new defaults for your option here
  skip_enabled: false,
  skip_threshold: 500,
}
export const OPTION_DICTIONARY: OptionsDictionary = {
  // add details for the option (the input element type, the bounds (min/max), etc)
  skip_enabled: 
  {
    type: "checkbox",
    desc: "Automatically skip shorts with fewer likes?",
  },
  skip_threshold: 
  {
    desc: "Skip shorts with fewer than this many likes:",
    type: "number",
    min:  0
  },
}

export var keybinds: StringDictionary = Object.assign( {}, DEFAULT_KEYBINDS )
export const setKeybinds = ( newKeybinds: StringDictionary ) => keybinds = newKeybinds

export function setKeybind( previousState: StringDictionary, command: string, newKey: string ): StringDictionary
{
  if ( previousState === null ) return null

  const newKeybinds = {...previousState}
  newKeybinds[ command ] = newKey

  return newKeybinds
}


export var options: PolyDictionary  = Object.assign( {}, DEFAULT_OPTIONS )
export const setOptions = ( newOptions: PolyDictionary ) => options = newOptions

export function setOption( previousState: PolyDictionary, option: string, value: string ): StringDictionary
{
  if ( previousState === null ) return null

  const newOptions = {...previousState}
  newOptions[ option ] = value

  return newOptions
}


export const storage = BROWSER.storage.local

const stateObject = {
  id          : 0,
  topId       : 0,
  volumeState : 0,
  
  actualVolume: null,
  skippedId   : null,
  
  muted       : false,
}
export const state = new Proxy( stateObject, {
  set: ( o: StateObject, prop: string, val: any ) => {
    o[ prop ] = val
    return true
  }
} )

// todo  - add formats from other langs (note: dont include duplicate keys)#
export const NUMBER_MODIFIERS: NumberDictionary = {
    // English
  "b":   1_000_000_000,
  "m":   1_000_000,
  "k":   1_000,

  // Italian
  "mln": 1_000_000,

  // Indian English
  "lakh": 100_000,

  // Portuguese
  "mil": 1_000,

  // French
  "mio": 1_000_000,
  "md":  1_000,

  // German
  "mrd": 1_000_000_000,
  "tsd": 1_000,

  // Japanese
  "億":  1_000_000_000,
  "万":  10_000,

  // Chinese (Simplified)
  "亿":  1_000_000_000,

  // Chinese (Traditional)
  "萬":  10_000,

  // Russian
  "млн": 1_000_000,
  "тыс": 1_000,

  // Hindi
  "करोड़": 10_000_000,
  "लाख":  100_000,

  // Arabic
  "مليون":   1_000_000,
  "مليار":   1_000_000_000,
  "ألف":     1_000,

  // Korean
  "억":  100_000_000,
  "만":  10_000,

  // Turkish
  "milyon":    1_000_000,
  "milyar":    1_000_000_000,
  "bin":       1_000,

  // Vietnamese
  "triệu":    1_000_000,
  "tỷ":       1_000_000_000,
  "nghìn":    1_000,

  // Thai
  "ล้าน":    1_000_000,
  "พันล้าน": 1_000_000_000,
  "พัน":     1_000,

  // Dutch
  "mld":  1_000_000_000,

  // Greek
  "εκ":   1_000_000,
  "δισ":  1_000_000_000,
  "χιλ":  1_000,

  // Swedish
  "mn":   1_000_000,
  "t":    1_000,
}