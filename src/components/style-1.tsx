import { FrameContext } from "frog";

export default (c: FrameContext, content: string): JSX.Element => (<div
  style={{
    alignItems: 'center',
    background: '#344afb',
    backgroundSize: '100% 100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100%',
    justifyContent: 'center',
    textAlign: 'center',
    width: '100%',
  }}
>
  
  <div
    style={{
      color: 'white',
      fontSize: 48,
      fontStyle: 'normal',
      letterSpacing: '-0.025em',
      lineHeight: 1.4,
      marginTop: 30,
      padding: '0 120px',
      whiteSpace: 'pre-wrap',
      marginLeft:64
    }}
  >
    {content}
  </div>
</div>)