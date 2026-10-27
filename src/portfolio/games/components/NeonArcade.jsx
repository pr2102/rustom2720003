import { useEffect, useRef, useState } from 'react'
import './neonArcade.css'

function ArcadeShell({ title, subtitle, score, time, children, running, onStart, played }) {
  return (
    <div className="neon-arcade">
      <header className="neon-hud"><div><p>RUSTOM / ARCADE LAB</p><h2>{title}</h2></div><div><span>SCORE</span><strong>{score.toString().padStart(3, '0')}</strong></div><div><span>{title === 'Neon Rush' ? 'SECONDS' : 'SHIELDS'}</span><strong>{time}</strong></div></header>
      <p className="neon-instructions">{subtitle}</p>
      {children}
      <footer className="neon-footer"><span role="status">{running ? 'SYSTEM ONLINE / GO!' : played ? `ROUND OVER / ${score} POINTS` : 'READY WHEN YOU ARE'}</span><button type="button" onClick={onStart}>{running ? 'Restart round' : played ? 'Play again' : 'Start game'}</button></footer>
    </div>
  )
}

export function NeonRushGame() {
  const [game, setGame] = useState({ running: false, played: false, score: 0, time: 30, target: 5, combo: 0 })
  const lastHit = useRef(0)

  useEffect(() => {
    if (!game.running) return undefined
    const id = window.setInterval(() => setGame((current) => current.time <= 1 ? { ...current, time: 0, running: false } : { ...current, time: current.time - 1 }), 1000)
    return () => window.clearInterval(id)
  }, [game.running])

  function handleHit(index, now, offset) {
    if (!game.running) return
    const fast = now - lastHit.current < 900
    lastHit.current = now
    setGame((current) => {
      if (!current.running) return current
      if (index !== current.target) return { ...current, combo: 0, score: Math.max(0, current.score - 2) }
      const combo = fast ? Math.min(5, current.combo + 1) : 1
      return { ...current, combo, score: current.score + combo * 10, target: (current.target + offset) % 16 }
    })
  }

  return (
    <ArcadeShell title="Neon Rush" subtitle="Hit the glowing node. Chain hits within 0.9 seconds for up to 5x points. Wrong nodes cost 2 points. Tap or use Tab + Enter." score={game.score} time={game.time} running={game.running} played={game.played} onStart={() => { lastHit.current = 0; setGame({ running: true, played: true, score: 0, time: 30, target: Math.floor(Math.random() * 16), combo: 0 }) }}>
      <div className="neon-rush-stage"><div className="neon-combo">{game.combo > 1 ? `${game.combo}x COMBO` : 'LOCK ON THE SIGNAL'}</div><div className="neon-node-grid">{Array.from({ length: 16 }, (_, index) => <button key={index} type="button" disabled={!game.running} aria-label={`Node ${index + 1}${game.running && game.target === index ? ', glowing target' : ''}`} className={game.running && game.target === index ? 'neon-node neon-node-active' : 'neon-node'} onClick={(event) => handleHit(index, event.timeStamp, 1 + Math.floor(Math.random() * 15))}><span /></button>)}</div></div>
    </ArcadeShell>
  )
}

export function MeteorRunGame() {
  const [game, setGame] = useState({ running: false, played: false, lane: 1, objects: [], score: 0, shields: 3, ticks: 0 })
  const field = useRef(null)

  useEffect(() => {
    if (!game.running) return undefined
    const id = window.setInterval(() => {
      const random = Math.random()
      const lane = Math.floor(Math.random() * 3)
      setGame((current) => {
        if (!current.running) return current
        const ticks = current.ticks + 1
        const speed = Math.min(4, 1.8 + ticks / 250)
        const moved = current.objects.map((object) => ({ ...object, y: object.y + speed }))
        const contacts = moved.filter((object) => object.y >= 82 && object.y < 90 && !object.checked)
        const hits = contacts.filter((object) => object.lane === current.lane && !object.star).length
        const stars = contacts.filter((object) => object.lane === current.lane && object.star).length
        const shields = Math.max(0, current.shields - hits)
        const objects = moved.filter((object) => object.y < 105).map((object) => ({ ...object, checked: object.checked || object.y >= 82 }))
        if (ticks % 10 === 0) objects.push({ id: ticks, lane, y: -8, star: random > 0.65, checked: false })
        return { ...current, ticks, objects, shields, score: current.score + 1 + stars * 100, running: shields > 0 }
      })
    }, 80)
    return () => window.clearInterval(id)
  }, [game.running])

  function move(delta) {
    setGame((current) => current.running ? { ...current, lane: Math.max(0, Math.min(2, current.lane + delta)) } : current)
  }

  return (
    <ArcadeShell title="Meteor Run" subtitle="Dodge the coral meteors. Collect mint energy crystals for +100 points. Move with arrow keys, A/D, or tap a lane. Three shields. One mission." score={game.score} time={game.shields} running={game.running} played={game.played} onStart={() => { setGame({ running: true, played: true, lane: 1, objects: [], score: 0, shields: 3, ticks: 0 }); field.current?.focus() }}>
      <div ref={field} tabIndex={0} role="group" aria-label="Meteor Run playfield. Use left and right arrows or A and D to move." className="neon-flight-stage" onKeyDown={(event) => { if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D'].includes(event.key)) { event.preventDefault(); move(['ArrowLeft', 'a', 'A'].includes(event.key) ? -1 : 1) } }}>
        <div className="neon-flight-horizon" aria-hidden="true" />
        {[0, 1, 2].map((lane) => <button key={lane} type="button" className="neon-lane" style={{ left: `${lane * 100 / 3}%` }} aria-label={`Move to lane ${lane + 1}`} disabled={!game.running} onClick={() => setGame((current) => current.running ? { ...current, lane } : current)} />)}
        {game.objects.map((object) => <div key={object.id} aria-hidden="true" className={object.star ? 'neon-crystal' : 'neon-meteor'} style={{ left: `${(object.lane + 0.5) * 100 / 3}%`, top: `${object.y}%` }} />)}
        <div aria-hidden="true" className="neon-ship" style={{ left: `${(game.lane + 0.5) * 100 / 3}%` }}><span /></div>
        {!game.running && <div className="neon-stage-message">{game.played ? 'MISSION COMPLETE' : 'INTO THE COSMOS'}<small>{game.played ? 'Ready for another run?' : 'Dodge. Collect. Survive.'}</small></div>}
      </div>
      <div className="neon-steering"><button type="button" disabled={!game.running} onClick={() => move(-1)} aria-label="Move left">← LEFT</button><span>CRYSTALS +100</span><button type="button" disabled={!game.running} onClick={() => move(1)} aria-label="Move right">RIGHT →</button></div>
    </ArcadeShell>
  )
}
