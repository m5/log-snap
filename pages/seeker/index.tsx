import React from 'react'
import styles from './seeker.module.css'

const lerp = (start: number, end: number, percent: number) => {
   return start + (start - end) * percent
}

interface IFollowerProps {
  children: React.ReactNode
  followerRef: React.RefObject<HTMLDivElement>
}

const MouseFollower = (props: IFollowerProps) => {
  const [followerLeft, setFollowerLeft] = React.useState(0)
  const [followerTop, setFollowerTop] = React.useState(0)
  const [mouseLeft, setMouseLeft] = React.useState(0)
  const [mouseTop, setMouseTop] = React.useState(0)

  React.useEffect(() => {
    document.onmousemove = function(e) {
      setMouseLeft(e.pageX)
      setMouseTop(e.pageY)
    }
  })

  React.useEffect(() => {
    const interval = setInterval(() => {
        setFollowerTop(lerp(followerTop, mouseTop, 0.01))
        setFollowerLeft(lerp(followerLeft, mouseLeft, 0.01))
    }, 10)
    return () => clearInterval(interval)
  }, [mouseLeft, mouseTop, followerTop, followerLeft])

  return (
    <div ref={props.followerRef} style={{top: followerTop, left: followerLeft, position: 'absolute'}}>
      {props.children}
    </div>
  )
}

const isColliding = (a: HTMLElement, b: HTMLElement) => {
  return a.offsetTop == b.offsetTop && a.offsetLeft == b.offsetLeft
}

const Page = () => {
  const [cardActive, setCardActive] = React.useState(false)
  const logoRef = React.useRef(null)
  const cardRef = React.useRef(null)

  React.useEffect(() => {
    setInterval(() => {
      if(logoRef.current && cardRef.current && isColliding(logoRef.current, cardRef.current)){
        setCardActive(true)
      }
    }, 10)
  }, [logoRef, cardRef])  

  const imgSrc = cardActive ? "/card-blue.png" : "/card-gray.png"

  return (
    <div className='wrap'>
      <MouseFollower followerRef={logoRef}>
        <img className={styles['logo-image']} src="/mercury-logo.png"/>
      </MouseFollower>

      <img ref={cardRef} src={imgSrc} className={styles["card-image"]} />
    </div>
  )
}

export default Page
