import "./scoreboard.css"


function Scoreboard() {
  return (
    <div className="scoreboardDiv">
      <h2>Scoreboard</h2>
      <table>
        <thead>
          <tr>
            <td></td>
            <td>Player</td>
            <td>Score</td>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{backgroundColor : 'blue', width : '40px', height : '40px'}}></td>
            <td>David</td>
            <td>1</td>
          </tr>
          <tr>
            <td style={{backgroundColor : 'red', width : '40px', height : '40px'}}></td>
            <td>Erik</td>
            <td>3</td>
          </tr>
          <tr>
            <td style={{backgroundColor : 'green', width : '40px', height : '40px'}}></td>
            <td>Mathias</td>
            <td>2</td>
          </tr>
          <tr>
            <td style={{backgroundColor : 'yellow', width : '40px', height : '40px'}}></td>
            <td>Sam</td>
            <td>5</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default Scoreboard