import { ArrowLeft, ArrowUpRight, Gamepad2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useGames } from '../games/GamesContext'
import { PageSection } from '../ui'
import './gamesLounge.css'

function GamePoster({ kind }) {
  return (
    <div aria-hidden="true" className={`lounge-poster lounge-poster-${kind}`}>
      <span className="lounge-poster-orbit" />
      {kind === 'rush' ? <div className="lounge-targets">{Array.from({ length: 9 }, (_, index) => <i key={index} className={index === 4 ? 'is-lit' : ''} />)}</div> : <><span className="lounge-planet" /><span className="lounge-rock lounge-rock-one" /><span className="lounge-rock lounge-rock-two" /><span className="lounge-rocket-trail" /><span className="lounge-rocket" /></>}
      <span className="lounge-poster-caption">{kind === 'rush' ? 'FOLLOW THE FREQUENCY' : 'TAKE THE SCENIC ROUTE'}</span>
    </div>
  )
}

export default function GamesPage() {
  const { games } = useGames()
  const featured = games.filter((game) => game.preview)
  const classics = games.filter((game) => !game.preview)

  return (
    <PageSection>
      <div className="games-lounge">
        <header className="lounge-topbar"><Link to="/contact"><ArrowLeft size={16} /> Back to portfolio</Link><span><Gamepad2 size={17} /> RY / PLAYGROUND</span></header>
        <div className="lounge-intro">
          <div><p className="lounge-eyebrow">SIDE QUESTS / BIG ENERGY</p><h1>A little less work.<br />A lot more <em>play.</em></h1><p className="lounge-description">A pocket-sized arcade for your next break. Test your reflexes, escape into orbit, or challenge a friend.</p></div>
          <div className="lounge-stamp" aria-label={`${games.length} games, no downloads`}><Gamepad2 size={38} /><strong>{games.length} games</strong><span>ZERO DOWNLOADS</span></div>
        </div>
        <div className="lounge-section-title"><h2>The main attractions</h2><span>01 / FEATURED</span></div>
        <div className="lounge-featured">
          {featured.map((game, index) => <Link key={game.id} to={game.id} className="lounge-feature"><GamePoster kind={game.preview} /><div className="lounge-feature-copy"><div className="lounge-feature-meta"><span>0{index + 1} / {game.preview === 'rush' ? 'REFLEX SPRINT' : 'COSMIC SURVIVAL'}</span><span className="lounge-play-icon"><ArrowUpRight size={24} /></span></div><h3>{game.title}</h3><p>{game.blurb}</p><div className="lounge-tags">{game.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div></Link>)}
        </div>
        <div className="lounge-section-title"><h2>Never out of style</h2><span>02 / THE CLASSICS</span></div>
        <div className="lounge-classics">{classics.map((game, index) => {
          const Icon = game.icon
          return <Link key={game.id} to={game.id} className="lounge-classic" style={{ '--card-tone': ['#f6d99b', '#c4dbce', '#d3dff0', '#f2c8b9'][index % 4] }}><span className="lounge-classic-icon"><Icon size={28} /></span><span className="lounge-classic-number">{String(index + 1).padStart(2, '0')}</span><h3>{game.title}</h3><p>{game.blurb}</p><span className="lounge-classic-cta">Let's play <ArrowUpRight size={18} /></span></Link>
        })}</div>
        <footer className="lounge-bottom"><span>BUILT WITH REACT. PLAYED WITH CURIOSITY.</span><span>Take a break. Stay a while.</span></footer>
      </div>
    </PageSection>
  )
}
