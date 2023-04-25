import React, { KeyboardEvent, useState } from 'react'
import styles from '@/styles/Synth.module.css'
import { PowerButton } from './PowerButton'
import { WhiteKey } from './WhiteKey'
import * as Tone from 'tone'
import { getState, setState } from '@/State'
import { BlackKey } from './BlackKey'
import { getSharp } from '@/Utils'

export function Keyboard() {
  const [power, setPower] = useState<boolean>(false)
  const [keysPressed, setKeysPressed] = useState<string[]>([])
  const [synthList, setSynthList] = useState<Tone.Synth[]>([])
  const [keysClicked, setKeysClicked] = useState<string[]>([])
  const [octave, setOctave] = useState<number>(4)

  let keys: JSX.Element[] = []

  const allowedUserKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l', ';', 'g', 'h', 'w', 'e', 'r', 'i', 'o']
  const whiteKeys = ['a', 's', 'd', 'f', 'j', 'k', 'l']
  const blackKeys = ['w', 'e', '', 'r', 'i', 'o'] // Extra blank char to account for the jump from E to F during iteration
  const pitches = ['C', 'D', 'E', 'F', 'G', 'A', 'B']

  const maxOctave = 7
  const minOctave = 0

  async function handleClickPowerButton() {
    setPower(!power)

    if (!power) {
      await Tone.start()
      let synths = [] 
      for (let i = 0; i < 13; i++)
        synths.push(new Tone.Synth().toDestination())
      setSynthList(synths)

    } else {
      synthList.forEach(synth => synth.dispose())
      setSynthList([])
    }
  }

  function handleKeyDown(e: KeyboardEvent) {
    const key = e.key.toLowerCase()
    if (!keysPressed.includes(key) && allowedUserKeys.includes(key)) {

      key === 'a' ? synthList[0].triggerAttack(`C${octave}`) : ''
      key === 's' ? synthList[1].triggerAttack(`D${octave}`) : ''
      key === 'd' ? synthList[2].triggerAttack(`E${octave}`) : ''
      key === 'f' ? synthList[3].triggerAttack(`F${octave}`) : ''
      key === 'j' ? synthList[4].triggerAttack(`G${octave}`) : ''
      key === 'k' ? synthList[5].triggerAttack(`A${octave}`) : ''
      key === 'l' ? synthList[6].triggerAttack(`B${octave}`) : ''
      key === ';' ? synthList[7].triggerAttack(`C${octave + 1}`) : ''
      
      key === 'w' ? synthList[8].triggerAttack(`C#${octave}`) : ''
      key === 'e' ? synthList[9].triggerAttack(`D#${octave}`) : ''
      key === 'r' ? synthList[10].triggerAttack(`F#${octave}`) : ''
      key === 'i' ? synthList[11].triggerAttack(`G#${octave}`) : ''
      key === 'o' ? synthList[12].triggerAttack(`A#${octave}`) : ''

      key === 'g' ? setOctave(octave - 1) : ''
      key === 'h' ? setOctave(octave + 1) : ''

      setKeysPressed([...keysPressed, key])
    }
  }

  function handleKeyUp(e: KeyboardEvent) {
    const key = e.key.toLowerCase()

    if (keysPressed.includes(key) && allowedUserKeys.includes(key)) {

      key === 'a' ? synthList[0].triggerRelease() : ''
      key === 's' ? synthList[1].triggerRelease() : ''
      key === 'd' ? synthList[2].triggerRelease() : ''
      key === 'f' ? synthList[3].triggerRelease() : ''
      key === 'j' ? synthList[4].triggerRelease() : ''
      key === 'k' ? synthList[5].triggerRelease() : ''
      key === 'l' ? synthList[6].triggerRelease() : ''
      key === ';' ? synthList[7].triggerRelease() : ''

      key === 'w' ? synthList[8].triggerRelease() : ''
      key === 'e' ? synthList[9].triggerRelease() : ''
      key === 'r' ? synthList[10].triggerRelease() : ''
      key === 'i' ? synthList[11].triggerRelease() : ''
      key === 'o' ? synthList[12].triggerRelease() : ''

      setKeysPressed(keysPressed.filter(k => k !== key))
    }
  }

  function handleMouse() {
    setKeysClicked(getState().keysClicked)
  }

  return (
    <div className={styles.parent}>
      <div
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
        onMouseDown={handleMouse}
        onMouseUp={handleMouse}
        className={styles.keyboardContainer}
      >
        <p>Synth is {synthList.length > 0 ? 'loaded' : 'not loaded: click the red power button'}</p>
        <div>
          <p>'g' to decrease the octave, 'h' to increase the octave</p>
          <p>Current octave: {octave}</p>
        </div>
        <div
          className={power ? styles.keyboardOn : styles.keyboardOff}
        >
          <PowerButton onClick={handleClickPowerButton} power={power} />
          
          <WhiteKey synth={synthList[0]} keyboardKey="a" pitch={`C${octave}`} keyDown={keysPressed.includes('a')} onClick={keysClicked.includes(`C${octave}`)} enabled={power} />
          <BlackKey synth={synthList[8]} keyboardKey="w" pitch={getSharp(`C${octave}`)} keyDown={keysPressed.includes('w')} onClick={keysClicked.includes(getSharp(`C${octave}`))} enabled={power} />

          <WhiteKey synth={synthList[1]} keyboardKey="s" pitch={`D${octave}`} keyDown={keysPressed.includes('s')} onClick={keysClicked.includes(`D${octave}`)} enabled={power} />
          <BlackKey synth={synthList[9]} keyboardKey="e" pitch={getSharp(`D${octave}`)} keyDown={keysPressed.includes('e')} onClick={keysClicked.includes(getSharp(`D${octave}`))} enabled={power} />

          <WhiteKey synth={synthList[2]} keyboardKey="d" pitch={`E${octave}`} keyDown={keysPressed.includes('d')} onClick={keysClicked.includes(`E${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[3]} keyboardKey="f" pitch={`F${octave}`} keyDown={keysPressed.includes('f')} onClick={keysClicked.includes(`F${octave}`)} enabled={power} />
          <BlackKey synth={synthList[10]} keyboardKey="r" pitch={getSharp(`F${octave}`)} keyDown={keysPressed.includes('r')} onClick={keysClicked.includes(getSharp(`F${octave}`))} enabled={power} />

          <WhiteKey synth={synthList[4]} keyboardKey="j" pitch={`G${octave}`} keyDown={keysPressed.includes('j')} onClick={keysClicked.includes(`G${octave}`)} enabled={power} />
          <BlackKey synth={synthList[11]} keyboardKey="i" pitch={getSharp(`D${octave}`)} keyDown={keysPressed.includes('i')} onClick={keysClicked.includes(getSharp(`G${octave}`))} enabled={power} />

          <WhiteKey synth={synthList[5]} keyboardKey="k" pitch={`A${octave}`} keyDown={keysPressed.includes('k')} onClick={keysClicked.includes(`A${octave}`)} enabled={power} />
          <BlackKey synth={synthList[12]} keyboardKey="o" pitch={getSharp(`A${octave}`)} keyDown={keysPressed.includes('o')} onClick={keysClicked.includes(getSharp(`A${octave}`))} enabled={power} />

          <WhiteKey synth={synthList[6]} keyboardKey="l" pitch={`B${octave}`} keyDown={keysPressed.includes('l')} onClick={keysClicked.includes(`B${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[7]} keyboardKey=";" pitch={`C${octave + 1}`} keyDown={keysPressed.includes(';')} onClick={keysClicked.includes(`C${octave + 1}`)} enabled={power} /> 
        </div>
      </div>
    </div>
  )
}

/**
 * 
 * 
 * <WhiteKey synth={synthList[0]} keyboardKey="a" pitch={`C${octave}`} keyDown={keysPressed.includes('a')} onClick={keysClicked.includes(`C${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[1]} keyboardKey="s" pitch={`D${octave}`} keyDown={keysPressed.includes('s')} onClick={keysClicked.includes(`D${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[2]} keyboardKey="d" pitch={`E${octave}`} keyDown={keysPressed.includes('d')} onClick={keysClicked.includes(`E${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[3]} keyboardKey="f" pitch={`F${octave}`} keyDown={keysPressed.includes('f')} onClick={keysClicked.includes(`F${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[4]} keyboardKey="j" pitch={`G${octave}`} keyDown={keysPressed.includes('j')} onClick={keysClicked.includes(`G${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[5]} keyboardKey="k" pitch={`A${octave}`} keyDown={keysPressed.includes('k')} onClick={keysClicked.includes(`A${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[6]} keyboardKey="l" pitch={`B${octave}`} keyDown={keysPressed.includes('l')} onClick={keysClicked.includes(`B${octave}`)} enabled={power} />
          <WhiteKey synth={synthList[7]} keyboardKey=";" pitch={`C${octave + 1}`} keyDown={keysPressed.includes(';')} onClick={keysClicked.includes(`C${octave + 1}`)} enabled={power} />
 */