import { useState } from 'react'
import './App.css'

const STORAGE_KEY = 'umuganda-community-data-v1'
const areas = ['Nyarugenge', 'Kimisagara', 'Kacyiru', 'Remera']
const wasteTypes = ['Plastic', 'Paper', 'Glass', 'Metal', 'Organic', 'General']
const navigation = [
  { id: 'dashboard', label: 'Overview', icon: '◫' },
  { id: 'collections', label: 'Collections', icon: '↻' },
  { id: 'reports', label: 'Waste reports', icon: '⚑' },
  { id: 'recycling', label: 'Recycling map', icon: '♻' },
  { id: 'learn', label: 'Learn & sort', icon: '▤' },
  { id: 'insights', label: 'Impact reports', icon: '▥' },
]
const todayLabel = new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())
const centers = [
  { name: 'Green Loop Recycling Hub', area: 'Nyarugenge', kind: 'Recycling center', accepts: 'Plastic · Paper · Metal', hours: '08:00–17:00', lat: -1.9498, lng: 30.0588 },
  { name: 'Kimisagara Eco-Point', area: 'Kimisagara', kind: 'Drop-off point', accepts: 'Plastic · Glass', hours: '07:30–18:00', lat: -1.9676, lng: 30.0452 },
  { name: 'Kacyiru Community Station', area: 'Kacyiru', kind: 'Collection point', accepts: 'Paper · Metal · E-waste', hours: '08:00–16:30', lat: -1.9283, lng: 30.0914 },
  { name: 'Remera Recovery Centre', area: 'Remera', kind: 'Recycling center', accepts: 'Plastic · Paper · Organic', hours: '08:00–17:30', lat: -1.9512, lng: 30.1126 },
]

function dateOffset(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)
  return date.toISOString().slice(0, 10)
}

function createInitialState() {
  return {
    collections: [
      { id: 'c1', area: 'Nyarugenge', date: dateOffset(1), time: '08:00', type: 'Mixed recyclables', collector: 'Jean M.', status: 'Scheduled' },
      { id: 'c2', area: 'Kimisagara', date: dateOffset(2), time: '09:30', type: 'Organic waste', collector: 'Aline U.', status: 'In progress' },
      { id: 'c3', area: 'Kacyiru', date: dateOffset(3), time: '08:30', type: 'General waste', collector: 'Patrick N.', status: 'Scheduled' },
      { id: 'c4', area: 'Remera', date: dateOffset(4), time: '10:00', type: 'Plastic & paper', collector: 'Jean M.', status: 'Scheduled' },
    ],
    reports: [
      { id: 'r1', title: 'Overflowing bin near the market', area: 'Nyarugenge', category: 'General', details: 'Waste is spilling onto the walkway beside the main market entrance.', date: dateOffset(-1), status: 'Open', image: '' },
      { id: 'r2', title: 'Illegal dumping by drainage channel', area: 'Kimisagara', category: 'Plastic', details: 'Several bags have been left beside the drainage channel.', date: dateOffset(-2), status: 'In progress', image: '' },
      { id: 'r3', title: 'Missed household collection', area: 'Kacyiru', category: 'Organic', details: 'The scheduled collection did not reach our street.', date: dateOffset(-3), status: 'Resolved', image: '' },
    ],
    activity: [
      { icon: '♻', title: 'Recycling target reached', text: 'Community recycled 68% of collected materials', time: 'Today' },
      { icon: '↻', title: 'Collection completed', text: 'Organic waste pickup in Kimisagara', time: 'Yesterday' },
      { icon: '⚑', title: 'New waste report', text: 'Overflowing bin near the market', time: 'Yesterday' },
    ],
    totalKg: 2840,
    recycledKg: 1930,
  }
}

function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? { ...createInitialState(), ...JSON.parse(saved) } : createInitialState()
  } catch {
    return createInitialState()
  }
}

function formatDate(value) {
  return new Date(`${value}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

function statusStyle(status) {
  if (status === 'Open') return 'urgent'
  if (status === 'In progress') return 'progress'
  if (status === 'Scheduled') return 'pending'
  return ''
}

function Button({ children, variant = 'primary', ...props }) {
  return <button className={`button ${variant}`} {...props}>{children}</button>
}

function Stat({ label, value, icon, tone, foot }) {
  return (
    <article className="stat-card">
      <div className="stat-top"><span>{label}</span><span className={`stat-icon ${tone}`}>{icon}</span></div>
      <strong className="stat-value">{value}</strong>
      <div className="stat-foot">{foot}</div>
    </article>
  )
}

function PageHeading({ kicker, title, description, children }) {
  return (
    <div className="page-heading">
      <div><p className="eyebrow">{kicker}</p><h1>{title}</h1><p>{description}</p></div>
      {children && <div className="heading-actions">{children}</div>}
    </div>
  )
}

function RecoveryChart() {
  const collected = [23, 39, 31, 52, 48, 67, 59, 81, 69, 92, 83, 106]
  const recycled = [12, 19, 17, 26, 23, 37, 31, 43, 40, 55, 53, 65]
  const points = (values) => values.map((value, index) => `${42 + index * 48},${155 - value}`).join(' ')
  return (
    <div className="chart-wrap">
      <svg viewBox="0 0 600 184" role="img" aria-label="Waste collection and recycling trend over the last twelve months">
        <defs><linearGradient id="areaFill" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="#438262" stopOpacity=".19" /><stop offset="1" stopColor="#438262" stopOpacity="0" /></linearGradient></defs>
        <line className="grid-line" x1="40" y1="50" x2="580" y2="50" /><line className="grid-line" x1="40" y1="95" x2="580" y2="95" /><line className="grid-line" x1="40" y1="140" x2="580" y2="140" />
        <text className="axis-label" x="4" y="53">1200</text><text className="axis-label" x="8" y="98">600</text><text className="axis-label" x="20" y="143">0</text>
        <polygon className="chart-area" points={`42,155 ${points(collected)} 570,155`} /><polyline className="chart-line" points={points(collected)} /><polyline className="chart-recycle" points={points(recycled)} />
        <circle className="chart-dot" cx="570" cy="49" r="3.5" />
        {['Dec', 'Feb', 'Apr', 'Jun', 'Aug', 'Oct'].map((month, index) => <text className="axis-label" x={38 + index * 96} y="174" key={month}>{month}</text>)}
      </svg>
    </div>
  )
}

function Dashboard({ state, onNavigate }) {
  const openCount = state.reports.filter((report) => report.status !== 'Resolved').length
  const next = [...state.collections].sort((a, b) => a.date.localeCompare(b.date))[0]
  return (
    <>
      <PageHeading kicker="KIGALI · RWANDA" title="Good morning, Amara" description={`Here's what's happening in your community today, ${todayLabel}.`}>
        <span className="date-chip">◷ &nbsp;This month</span><Button onClick={() => onNavigate('reports')}>＋ &nbsp;Report an issue</Button>
      </PageHeading>
      <section className="stats-grid">
        <Stat label="Waste collected" value={`${(state.totalKg / 1000).toFixed(2)} t`} icon="↻" tone="green" foot={<><b className="positive">↑ 12%</b> &nbsp;vs last month</>} />
        <Stat label="Recycled this month" value={`${(state.recycledKg / 1000).toFixed(2)} t`} icon="♻" tone="yellow" foot={<><b className="positive">↑ 8%</b> &nbsp;vs last month</>} />
        <Stat label="Open community reports" value={openCount} icon="⚑" tone="coral" foot={`${state.reports.length - openCount} resolved this month`} />
        <Stat label="Next collection" value={next ? formatDate(next.date) : '—'} icon="◷" tone="blue" foot={next ? `${next.area} · ${next.time}` : 'No collections scheduled'} />
      </section>
      <section className="dashboard-grid">
        <article className="panel chart-panel"><div className="panel-head"><div><h2>Waste recovery</h2><p>Collected and recycled · last 12 months</p></div><div className="chart-legend"><span><i className="legend-dot collected" />Collected</span><span><i className="legend-dot recycled" />Recycled</span></div></div><RecoveryChart /></article>
        <article className="panel activity-panel"><div className="panel-head"><div><h2>Community activity</h2><p>Recent updates from your area</p></div><button className="text-link" onClick={() => onNavigate('insights')}>View all →</button></div><div className="activity-list">{state.activity.slice(0, 4).map((item, index) => <div className="activity-item" key={`${item.title}-${index}`}><span className="activity-symbol">{item.icon}</span><span className="activity-copy"><strong>{item.title}</strong><small>{item.text}</small></span><span className="activity-time">{item.time}</span></div>)}</div></article>
      </section>
      <section className="bottom-grid">
        <article className="panel"><div className="panel-head"><div><h2>Upcoming collections</h2><p>Collection runs across Kigali</p></div><button className="text-link" onClick={() => onNavigate('collections')}>Full schedule →</button></div><div className="table-wrap"><table><thead><tr><th>Area</th><th>Date</th><th>Time</th><th>Waste type</th><th>Collector</th><th>Status</th></tr></thead><tbody>{[...state.collections].sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4).map((item) => <tr key={item.id}><td><strong>{item.area}</strong></td><td>{formatDate(item.date)}</td><td>{item.time}</td><td>{item.type}</td><td>{item.collector || 'Unassigned'}</td><td><span className={`status ${statusStyle(item.status)}`}>{item.status}</span></td></tr>)}</tbody></table></div></article>
        <article className="panel map-panel"><div className="panel-head"><div><h2>Recycling around Kigali</h2><p>Community drop-off locations</p></div><button className="text-link" onClick={() => onNavigate('recycling')}>Explore map →</button></div><div className="map-preview"><iframe title="Map of Kigali recycling locations" src="https://www.openstreetmap.org/export/embed.html?bbox=30.012%2C-1.991%2C30.128%2C-1.902&amp;layer=mapnik&amp;marker=-1.9441%2C30.0619" loading="lazy" /></div></article>
      </section>
      <p className="demo-note">Demo workspace · Sample activity and recycling locations are illustrative, not verified service listings.</p>
    </>
  )
}

function CollectionPage({ state, role, onRequest, onAdvance }) {
  const isMember = role === 'member'
  return (
    <>
      <PageHeading kicker="ROUTES & PICKUPS" title="Collection schedule" description="Plan pickups, assign collection teams, and keep residents in the loop." />
      <section className="stats-grid">
        <Stat label="Scheduled pickups" value={state.collections.length} icon="◷" tone="blue" foot="Across 4 Kigali sectors" /><Stat label="Collection teams" value="4" icon="♧" tone="green" foot="Active this week" /><Stat label="On-time rate" value="94%" icon="✓" tone="yellow" foot={<><b className="positive">↑ 3%</b> &nbsp;this month</>} /><Stat label="Waste collected" value={`${(state.totalKg / 1000).toFixed(2)} t`} icon="↻" tone="coral" foot="Month to date" />
      </section>
      <div className="section-grid">
        <section className="panel"><div className="panel-head"><div><h2>Upcoming pickups</h2><p>Collection runs scheduled in your community.</p></div><span className="date-chip">{state.collections.length} scheduled</span></div><div className="schedule-list">{[...state.collections].sort((a, b) => a.date.localeCompare(b.date)).map((item) => <article className="schedule-card" key={item.id}><div className="schedule-date"><strong>{new Date(`${item.date}T12:00:00`).getDate()}</strong><small>{new Date(`${item.date}T12:00:00`).toLocaleDateString('en', { month: 'short' })}</small></div><div><h3>{item.area} · {item.type}</h3><p>{item.time} · Collector: {item.collector || 'Unassigned'}</p></div><div className="schedule-status"><span className={`status ${statusStyle(item.status)}`}>{item.status}</span>{!isMember && item.status !== 'Completed' && <button className="text-link" onClick={() => onAdvance(item.id)}>Update →</button>}</div></article>)}</div></section>
        <form className="panel form-panel" onSubmit={onRequest}><h2>Request a collection</h2><p>Let the community team know what needs to be collected.</p><div className="form-grid"><label className="field"><span>Area</span><select name="area" required defaultValue=""><option value="" disabled>Choose area</option>{areas.map((area) => <option key={area}>{area}</option>)}</select></label><label className="field"><span>Waste type</span><select name="type"><option>Mixed recyclables</option><option>Organic waste</option><option>General waste</option><option>Plastic & paper</option></select></label><label className="field"><span>Preferred date</span><input name="date" type="date" min={dateOffset(0)} required /></label><label className="field"><span>Preferred time</span><input name="time" type="time" defaultValue="08:00" required /></label>{!isMember && <label className="field full"><span>Assign collector</span><select name="collector"><option>Jean M.</option><option>Aline U.</option><option>Patrick N.</option><option>Chantal B.</option></select></label>}</div><div className="form-actions"><Button type="submit">Request pickup</Button></div></form>
      </div>
    </>
  )
}

function ReportsPage({ state, role, onSubmit, onAdvance }) {
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState('all')
  const open = state.reports.filter((report) => report.status !== 'Resolved').length
  const reports = state.reports.filter((report) => (filter === 'all' || report.status === filter) && `${report.title} ${report.area} ${report.category}`.toLowerCase().includes(query.toLowerCase()))
  return (
    <>
      <PageHeading kicker="COMMUNITY VOICE" title="Waste reports" description="Report dumping, missed collections, or overflowing bins. Your report helps the team respond." />
      <section className="stats-grid"><Stat label="Total reports" value={state.reports.length} icon="⚑" tone="coral" foot="Submitted by residents" /><Stat label="Need attention" value={open} icon="!" tone="yellow" foot="Awaiting resolution" /><Stat label="Resolved" value={state.reports.length - open} icon="✓" tone="green" foot="Issues closed by the team" /><Stat label="Typical response" value="1.4 days" icon="◷" tone="blue" foot="Average this month" /></section>
      <div className="section-grid"><form className="panel form-panel" onSubmit={onSubmit}><h2>Tell us what happened</h2><p>Include a clear location so the right team can act quickly.</p><div className="form-grid"><label className="field full"><span>Issue title</span><input name="title" placeholder="e.g. Overflowing bin near the market" maxLength="90" required /></label><label className="field"><span>Area</span><select name="area" required defaultValue=""><option value="" disabled>Choose area</option>{areas.map((area) => <option key={area}>{area}</option>)}</select></label><label className="field"><span>Waste type</span><select name="category">{wasteTypes.map((type) => <option key={type}>{type}</option>)}</select></label><label className="field full"><span>Details</span><textarea name="details" placeholder="Describe the issue and nearby landmarks…" maxLength="500" required /></label><label className="field full"><span>Photo (optional)</span><input name="photo" type="file" accept="image/*" /><small>Images under 1 MB are saved in this browser on this device.</small></label></div><div className="form-actions"><Button type="submit">Submit report &nbsp;→</Button></div></form>
        <section><article className="panel report-board"><div className="filter-row"><input aria-label="Search reports" placeholder="Search reports…" value={query} onChange={(event) => setQuery(event.target.value)} /><select aria-label="Filter by status" value={filter} onChange={(event) => setFilter(event.target.value)}><option value="all">All statuses</option><option>Open</option><option>In progress</option><option>Resolved</option></select></div><div className="report-list">{reports.length ? reports.map((report) => <article className="report-card" key={report.id}><div className="report-thumb">{report.image ? <img src={report.image} alt="Waste issue" /> : '⚑'}</div><div className="report-description"><h3>{report.title}</h3><p>{report.details}</p><div className="report-meta"><span>{report.area}</span><span>{report.category}</span><span>{formatDate(report.date)}</span></div></div>{role !== 'member' && report.status !== 'Resolved' ? <Button variant="secondary small" onClick={() => onAdvance(report.id)}>{report.status === 'Open' ? 'Start work' : 'Resolve'}</Button> : <span className={`status ${statusStyle(report.status)}`}>{report.status}</span>}</article>) : <div className="empty-state">No reports match those filters.</div>}</div></article><article className="panel guidance-panel"><div className="panel-head"><div><h2>Report follow-up</h2><p>Track progress from submission to resolution.</p></div><span className="stat-icon green">i</span></div><p>Your location and description help the sanitation team prioritize collection. The team can update the status as they review and resolve the issue.</p></article></section>
      </div>
    </>
  )
}

function RecyclingPage() {
  return <><PageHeading kicker="FIND A DROP-OFF" title="Recycling map" description="Find nearby collection points and see what materials each center accepts."><a className="button secondary" href="https://www.openstreetmap.org/?mlat=-1.9441&mlon=30.0619#map=13/-1.9441/30.0619" target="_blank" rel="noreferrer">↗ &nbsp;Open map</a></PageHeading><div className="section-grid"><section className="panel map-full-panel"><div className="panel-head"><div><h2>Recycling points around Kigali</h2><p>Illustrative locations · confirm availability locally</p></div><span className="center-type">{centers.length} locations</span></div><div className="map-full"><iframe title="OpenStreetMap centered on Kigali" src="https://www.openstreetmap.org/export/embed.html?bbox=30.012%2C-1.991%2C30.128%2C-1.902&amp;layer=mapnik&amp;marker=-1.9441%2C30.0619" loading="lazy" /></div></section><section><div className="section-title"><h2>Nearby locations</h2><p>Community drop-off and recycling centers</p></div><div className="center-list">{centers.map((center) => <article className="center-card" key={center.name}><div className="center-topline"><h3>{center.name}</h3><span className="center-type">{center.kind}</span></div><p>{center.area} · {center.accepts}</p><div className="center-details"><span>◷ {center.hours}</span><a href={`https://www.openstreetmap.org/?mlat=${center.lat}&mlon=${center.lng}#map=16/${center.lat}/${center.lng}`} target="_blank" rel="noreferrer">⌖ View map</a></div></article>)}</div></section></div><p className="demo-note">Locations shown are sample project data for the Kigali prototype, not confirmed recycling services.</p></>
}

function LearnPage({ onNavigate }) {
  const materials = [
    ['♻', 'Plastic', 'Rinse bottles and containers. Keep plastic bags and soft film separate where possible.', 'Clean bottles, containers, and rigid packaging'],
    ['▤', 'Paper', 'Keep paper and cardboard dry. Flatten boxes to save room in collection bins.', 'Newspapers, office paper, and clean cardboard'],
    ['◇', 'Glass', 'Separate bottles by color if your local center asks. Keep broken glass apart.', 'Glass bottles and jars; rinse before sorting'],
    ['◈', 'Metal', 'Empty cans and rinse food residue. Fold sharp edges inward when safe.', 'Aluminium cans, steel tins, and clean scrap'],
    ['◉', 'Organic', 'Use a covered container for food scraps. Keep plastics out of compost.', 'Fruit and vegetable scraps, leaves, and coffee grounds'],
    ['▧', 'General waste', 'Use this category only for items that cannot be reused or recycled locally.', 'Contaminated or non-recyclable household waste'],
  ]
  return <><PageHeading kicker="SMALL HABITS, BIG IMPACT" title="Learn to sort" description="A little separation at home makes collection safer and gives more materials a second life."><Button variant="secondary" onClick={() => onNavigate('recycling')}>Find a recycling point →</Button></PageHeading><section className="learn-banner"><div><p className="eyebrow">THE 3R PRINCIPLE</p><h2>Reduce. Reuse. Recycle.</h2><p>Start with less waste. Give useful things another life. Recycle what remains.</p></div><span className="learn-pill">A cleaner Kigali starts at home</span></section><section className="sort-grid">{materials.map(([icon, title, description, examples]) => <article className="sort-card" key={title}><div className="sort-color" /><div className="sort-card-body"><span>{icon}</span><h3>{title}</h3><p>{description}</p><small><strong>Good for:</strong> {examples}</small></div></article>)}</section><section className="panel why-panel"><div className="panel-head"><div><h2>Why sorting matters</h2><p>Better separation protects people and the environment.</p></div></div><div className="benefit-grid"><div className="metric-row"><span>Cleaner neighborhoods</span><strong>↓ litter</strong></div><div className="metric-row"><span>Materials recovered</span><strong>↑ reuse</strong></div><div className="metric-row"><span>Safer collection</span><strong>✓ health</strong></div></div></section></>
}

function InsightsPage({ state, onNavigate }) {
  const rate = state.totalKg ? Math.round((state.recycledKg / state.totalKg) * 100) : 0
  const resolved = state.reports.filter((report) => report.status === 'Resolved').length
  const exportCsv = () => {
    const rows = [['Title', 'Area', 'Category', 'Date', 'Status'], ...state.reports.map((report) => [report.title, report.area, report.category, report.date, report.status])]
    const csv = rows.map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(',')).join('\n')
    const link = document.createElement('a')
    link.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    link.download = 'umuganda-community-reports.csv'
    link.click()
    URL.revokeObjectURL(link.href)
  }
  return <><PageHeading kicker="COMMUNITY PERFORMANCE" title="Impact reports" description="A snapshot of collection, recycling, and community participation in Kigali."><Button variant="secondary" onClick={exportCsv}>↓ &nbsp;Export report</Button></PageHeading><section className="impact-grid"><article className="impact-highlight"><p className="eyebrow">MATERIALS RECOVERED THIS MONTH</p><strong>{(state.recycledKg / 1000).toFixed(2)} tonnes</strong><p>Of {(state.totalKg / 1000).toFixed(2)} tonnes of waste collected</p></article><div className="metric-list"><div className="metric-row"><span>Recycling rate</span><strong>{rate}%</strong></div><div className="metric-row"><span>Registered households</span><strong>386</strong></div><div className="metric-row"><span>Community clean-ups</span><strong>8</strong></div><div className="metric-row"><span>Reports resolved</span><strong>{resolved} / {state.reports.length}</strong></div></div></section><section className="dashboard-grid insights-grid"><article className="panel chart-panel"><div className="panel-head"><div><h2>Waste recovery trend</h2><p>Monthly collection vs. recycling</p></div><span className="date-chip">Community</span></div><RecoveryChart /></article><article className="panel materials-panel"><div className="panel-head"><div><h2>Materials collected</h2><p>Illustrative sorting totals</p></div></div>{[['Plastic', 36, '#3e8b61'], ['Organic', 27, '#d2b249'], ['Paper', 18, '#6093b3'], ['Metal & glass', 19, '#d77b5e']].map(([label, percent, color]) => <div className="bar-row" key={label}><div><span>{label}</span><strong>{percent}%</strong></div><div className="bar-track"><span style={{ width: `${percent}%`, background: color }} /></div></div>)}</article></section><section className="panel recent-reports"><div className="panel-head"><div><h2>Recent issue reports</h2><p>Tracking community sanitation concerns</p></div><button className="text-link" onClick={() => onNavigate('reports')}>View reports →</button></div><div className="table-wrap"><table><thead><tr><th>Issue</th><th>Area</th><th>Category</th><th>Reported</th><th>Status</th></tr></thead><tbody>{state.reports.map((report) => <tr key={report.id}><td><strong>{report.title}</strong></td><td>{report.area}</td><td>{report.category}</td><td>{formatDate(report.date)}</td><td><span className={`status ${statusStyle(report.status)}`}>{report.status}</span></td></tr>)}</tbody></table></div></section><p className="demo-note">Illustrative baseline metrics for the project prototype. Replace with verified monitoring data during implementation.</p></>
}

function App() {
  const [data, setData] = useState(loadState)
  const [view, setView] = useState('dashboard')
  const [role, setRole] = useState('member')
  const [menuOpen, setMenuOpen] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [toast, setToast] = useState('')

  const notify = (message) => {
    setToast(message)
    window.setTimeout(() => setToast(''), 2600)
  }
  const updateData = (updater) => {
    setData((current) => {
      const next = updater(current)
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { notify('Browser storage is full. Remove a large photo and try again.') }
      return next
    })
  }
  const addActivity = (current, icon, title, text) => [{ icon, title, text, time: 'Just now' }, ...current.activity].slice(0, 8)
  const navigate = (nextView) => {
    setView(nextView)
    setMenuOpen(false)
    setNotificationsOpen(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
  const submitReport = async (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const file = fields.get('photo')
    let image = ''
    if (file?.size) {
      if (file.size > 1024 * 1024) { notify('Choose an image smaller than 1 MB.'); return }
      image = await new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(file)
      }).catch(() => '')
    }
    const report = { id: `r${Date.now()}`, title: fields.get('title').trim(), area: fields.get('area'), category: fields.get('category'), details: fields.get('details').trim(), date: dateOffset(0), status: 'Open', image }
    updateData((current) => ({ ...current, reports: [report, ...current.reports], activity: addActivity(current, '⚑', 'New waste report', report.title) }))
    form.reset()
    notify('Report submitted. Thanks for looking out for your community.')
  }
  const submitCollection = (event) => {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    const collection = { id: `c${Date.now()}`, area: fields.get('area'), type: fields.get('type'), date: fields.get('date'), time: fields.get('time'), collector: fields.get('collector') || 'Community team', status: 'Scheduled' }
    updateData((current) => ({ ...current, collections: [...current.collections, collection], activity: addActivity(current, '↻', 'Collection requested', `${collection.area} · ${collection.type}`) }))
    form.reset()
    notify('Collection request added to the schedule.')
  }
  const advanceReport = (id) => updateData((current) => {
    const report = current.reports.find((item) => item.id === id)
    const status = report.status === 'Open' ? 'In progress' : 'Resolved'
    return { ...current, reports: current.reports.map((item) => item.id === id ? { ...item, status } : item), activity: addActivity(current, '✓', 'Report status updated', report.title) }
  })
  const advanceCollection = (id) => updateData((current) => {
    const collection = current.collections.find((item) => item.id === id)
    const status = collection.status === 'Scheduled' ? 'In progress' : 'Completed'
    return { ...current, collections: current.collections.map((item) => item.id === id ? { ...item, status } : item), totalKg: current.totalKg + (status === 'Completed' ? 120 : 0), recycledKg: current.recycledKg + (status === 'Completed' ? 78 : 0), activity: addActivity(current, '↻', 'Collection status updated', `${collection.area}: ${status.toLowerCase()}`) }
  })

  const pageTitles = Object.fromEntries(navigation.map((item) => [item.id, item.label]))
  return (
    <div className="app-shell">
      {menuOpen && <button className="sidebar-scrim" aria-label="Close navigation" onClick={() => setMenuOpen(false)} />}
      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <a className="brand" href="#dashboard" onClick={(event) => { event.preventDefault(); navigate('dashboard') }}><span className="brand-mark" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 4c-6 4-9 9-9 15a9 9 0 0 0 18 0c0-6-3-11-9-15Z" /><path d="M11 20c3 0 7-3 10-8M14 24c0-3 0-5-1-7" /></svg></span><span><strong>umuganda</strong><small>COMMUNITY CARE</small></span></a>
        <div className="community-switch"><span className="switch-icon">K</span><span><strong>Kigali, Rwanda</strong><small>Community workspace</small></span><span className="switch-chevron">⌄</span></div>
        <p className="nav-label">WORKSPACE</p><nav className="primary-nav" aria-label="Main navigation">{navigation.slice(0, 5).map((item) => <button key={item.id} className={`nav-item ${view === item.id ? 'active' : ''}`} onClick={() => navigate(item.id)}><span className="nav-icon">{item.icon}</span>{item.label}{item.id === 'reports' && <span className="nav-count">{data.reports.filter((report) => report.status !== 'Resolved').length}</span>}</button>)}</nav>
        <p className="nav-label nav-label-lower">MANAGEMENT</p><nav className="primary-nav" aria-label="Management navigation"><button className={`nav-item ${view === 'insights' ? 'active' : ''}`} onClick={() => navigate('insights')}><span className="nav-icon">▥</span>Impact reports</button></nav>
        <div className="sidebar-bottom"><div className="campaign-card"><span className="campaign-icon">✳</span><strong>Umuganda is coming</strong><p>Community clean-up day<br />Last Saturday of each month</p><button onClick={() => navigate('collections')}>See the schedule <span>→</span></button></div><div className="profile-row"><div className="avatar">AK</div><span className="profile-copy"><strong>Amara K.</strong><small>{role === 'member' ? 'Community member' : role === 'collector' ? 'Waste collector' : 'Administrator'}</small></span><span className="more-button" aria-hidden="true">···</span></div></div>
      </aside>
      <main className="main-area">
        <header className="topbar"><button className="mobile-menu" aria-label="Open menu" onClick={() => setMenuOpen(true)}>☰</button><div className="breadcrumbs"><span>Community</span><span className="crumb-slash">/</span><strong>{pageTitles[view]}</strong></div><div className="topbar-actions"><label className="role-control"><span>Viewing as</span><select aria-label="Choose user role" value={role} onChange={(event) => setRole(event.target.value)}><option value="member">Community member</option><option value="collector">Waste collector</option><option value="admin">Administrator</option></select></label><button className="icon-button notification-button" aria-label="View notifications" aria-expanded={notificationsOpen} onClick={() => setNotificationsOpen(!notificationsOpen)}>♧<i /></button><div className="top-avatar">AK</div></div></header>
        {notificationsOpen && <aside className="notification-popover"><h3>Community updates</h3><div className="notification-entry"><strong>Collection reminder</strong><br />{data.collections.filter((item) => item.status === 'Scheduled').length} collection runs are scheduled this week.<small>Today · Kigali</small></div><div className="notification-entry"><strong>{data.reports.filter((item) => item.status !== 'Resolved').length} reports need attention</strong><br />The sanitation team is reviewing community reports.<small>Community reports</small></div><div className="notification-entry"><strong>Umuganda clean-up day</strong><br />Join your neighbors on the last Saturday of the month.<small>Kigali, Rwanda</small></div></aside>}
        <div className="page-content" key={view}>
          {view === 'dashboard' && <Dashboard state={data} onNavigate={navigate} />}
          {view === 'collections' && <CollectionPage state={data} role={role} onRequest={submitCollection} onAdvance={advanceCollection} />}
          {view === 'reports' && <ReportsPage state={data} role={role} onSubmit={submitReport} onAdvance={advanceReport} />}
          {view === 'recycling' && <RecyclingPage />}
          {view === 'learn' && <LearnPage onNavigate={navigate} />}
          {view === 'insights' && <InsightsPage state={data} onNavigate={navigate} />}
        </div>
        <footer className="app-footer"><span>UMUGANDA COMMUNITY CARE</span><span>Cleaner streets, stronger communities.</span><span>Kigali · Rwanda</span></footer>
      </main>
      {toast && <div className="toast" role="status" aria-live="polite">{toast}</div>}
    </div>
  )
}

export default App
