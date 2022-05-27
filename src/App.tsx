import * as C from './app.styles.'
import logoImage from './assets/devmemory_logo.png'
import RestartIcon from './svgs/restart.svg'
import { InfoItem } from './components/infoItem'
import { Button } from './components/button'
import { useEffect, useState } from 'react'
import { GridItemType } from './types/GridItemType'
import { items } from './data/items'
import { GridItem } from './components/GridItem'
import { formatTimeElapsed } from './helpers/FormatTimeElapsed'

const App = () => {
  const [playing, setPlaying] = useState<boolean>(false)
  const [timeElapsed, setTimeElapsed] = useState<number>(0)
  const [moveCount, setMoveCount] = useState<number>(0)
  const [showCount, setShowCount] = useState<number>(0)
  const [combinationsLeft, setCombinationsLeft] = useState<number>(items.length)
  const [gridItems, setGridItems] = useState<GridItemType[]>([])

  useEffect(() => resetAndCreateGrid(), [])

  useEffect(() => {
    const timer = setInterval(() => {
      if(playing) setTimeElapsed(timeElapsed + 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [playing, timeElapsed])

  useEffect(() => {
    if(showCount === 2) {
      let opened = gridItems.filter(item => item.shown === true)
      if(opened.length === 2) {
        if(opened[0].item === opened[1].item) {
          let tmpGrid = [...gridItems]
          for(let i in tmpGrid) {
            if(tmpGrid[i].shown) {
              tmpGrid[i].permanentShown = true
              tmpGrid[i].shown = false
            }
          }
          setGridItems(tmpGrid)
          setShowCount(0)
          
          setCombinationsLeft(combinationsLeft => combinationsLeft - 1)
        } else {
          setTimeout(() => {
            let tmpGrid = [...gridItems]
            for(let i in tmpGrid) {
              tmpGrid[i].shown = false
            }
            setGridItems(tmpGrid)
            setShowCount(0)
          }, 1000)
        }

        setMoveCount(moveCount => moveCount + 1)
      }
    }
  }, [showCount, gridItems])

  useEffect(() => {
    if(combinationsLeft === 0 && gridItems.every(item => item.permanentShown === true)) {
      setPlaying(false)
    }
  }, [combinationsLeft, gridItems])

  const resetAndCreateGrid = () => {
    // Reset
    setTimeElapsed(0)
    setMoveCount(0)
    setShowCount(0)
    setCombinationsLeft(items.length)

    // Criar o Grid
    let tmpGrid: GridItemType[] = []
    for(let i = 0; i < (items.length * 2); i++) {
      tmpGrid.push({
        item: null,
        shown: false,
        permanentShown: false
      })
    }
    for(let w = 0; w < 2; w++) {
      for(let i = 0; i < items.length; i++) {
        let pos = -1
        while(pos < 0 || tmpGrid[pos].item !== null) {
          pos = Math.floor(Math.random() * (items.length * 2))
        }
        tmpGrid[pos].item = i
      }
    }

    setGridItems(tmpGrid)

    // Começar Jogo
    setPlaying(true)
  }

  const ItemClick = (index: number) => {
    if(playing && index !== null && showCount < 2) {
      let tmpGrid = [...gridItems]

      if(tmpGrid[index].permanentShown === false && tmpGrid[index].shown === false) {
        tmpGrid[index].shown = true
        setShowCount(showCount + 1)
      }

      setGridItems(tmpGrid)
    }
  }

  return (
    <C.Container>
      <C.Info>
        <C.LogoLink href="">
          <img src={logoImage} width="200" alt="" />
        </C.LogoLink>
        <C.InfoArea>
          <InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)}  />
          <InfoItem label='Movimentos' value={moveCount.toString()} />
          <InfoItem label='Combinações Restantes' value={combinationsLeft.toString()} />
        </C.InfoArea>
        <Button icon={RestartIcon} label="Reiniciar" onClick={resetAndCreateGrid} />
        <Button label="Pausar Jogo" onClick={() => {
          if(combinationsLeft > 0) {
            if(playing === true) {
              setPlaying(false)
            } else {
              setPlaying(true)
            }
          } else {
            setPlaying(false)
          }
        }} />
      </C.Info>
      <C.GridArea>
        <C.Grid>
          {gridItems.map((item, index) => (
            <GridItem key={index} item={item} onClick={() => ItemClick(index)}/>
          ))}
        </C.Grid>
      </C.GridArea>
    </C.Container>
  )
}
export default App