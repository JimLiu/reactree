import React from 'react'
import { render } from 'react-dom'
import { default as TreeView } from './src'
import { NormalSource } from './sources'
import DemoDragAndDrop from './DemoDragAndDrop'
import SAMPLE from './sample'

const source1 = new NormalSource(SAMPLE.AB)
const source2 = new NormalSource(SAMPLE.DEEP2)
const dnd = new DemoDragAndDrop()
render(
  (
    <div style={{
      height: '400px'
    }}>
      <div style={{
        height: '100%',
        width: '400px',
        border: '1px solid red',
        display: 'inline-block'
      }}>
        <TreeView dataSource={source1} dnd={dnd}/>
      </div>
      <div style={{
        height: '100%',
        width: '400px',
        border: '1px solid red',
        display: 'inline-block'
      }}>
        <TreeView dataSource={source2} dnd={dnd} />
      </div>
    </div>
  ),
  document.getElementById('root')
)