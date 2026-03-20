const LoadingScreen = () => (
  <div style={{
    position: 'fixed', inset: 0,
    background: 'var(--bg-primary)',
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    zIndex: 9999
  }}>
    <div style={{ fontSize: '24px', fontWeight: '700',
      color: 'var(--text-primary)', marginBottom: '24px'
    }}>PaperPilot</div>
    <div style={{
      width: '200px', height: '3px',
      background: 'var(--border-color)',
      borderRadius: '2px', overflow: 'hidden'
    }}>
      <div style={{
        height: '100%',
        background: 'var(--accent)',
        borderRadius: '2px',
        animation: 'loading-bar 1.5s ease infinite'
      }}/>
    </div>
  </div>
)

export default LoadingScreen
