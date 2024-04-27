import { FrameContext } from "frog";

export default (c: FrameContext, content:string): JSX.Element => (<div
  style={{
    alignItems: 'center',
    background: '#011082',
    backgroundSize: '100% 100%',
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'nowrap',
    height: '100%',
    // justifyContent: 'center',
    textAlign: 'right',
    width: '100%',
  }}
>

<img src="/images/rawr.png?ver=1" width={714} height={536} style={{
    position: 'absolute',
    bottom: -24, left: -128
  }}/>

  <div
    style={{
      color: 'white',
      fontSize: 48,
      fontStyle: 'normal',
      letterSpacing: '-0.025em',
      lineHeight: 1.4,
      marginTop: 30,
      paddingLeft:360,
      paddingRight: 48,
      whiteSpace: 'pre-wrap',
    }}
  >
    {content}
  </div>

</div>)