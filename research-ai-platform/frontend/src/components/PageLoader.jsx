const PageLoader = ({ text = "AI is thinking..." }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', padding: '32px',
    gap: '16px'
  }}>
    <div style={{ display: 'flex', gap: '8px' }}>
      {[0, 1, 2].map(i => (
        <div key={i} style={{
          width: '10px', height: '10px',
          borderRadius: '50%',
          background: 'var(--accent)',
          animation: `bounce 0.8s ease infinite`,
          animationDelay: `${i * 0.2}s`
        }}/>
      ))}
    </div>
    <span style={{
      color: 'var(--text-muted)',
      fontSize: '14px'
    }}>{text}</span>
  </div>
)

export default PageLoader
