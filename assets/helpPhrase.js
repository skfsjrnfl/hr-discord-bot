exports.helpPhrase = `<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="ie=edge" />
  <style>
    body {
      font-family: "Poppins", Arial, Helvetica, sans-serif;
      background: rgb(22, 22, 22);
      color: #fff;
      max-width: 500px;
    }

    .heading {
      display: flex;
      align-items: center;
      flex-direction: row;
      margin-bottom: 20px;
    }

    .phraseBox {
      max-width: 100%;
      word-break: keep-all;
      display: flex;
      flex-direction: column;
    }

    .pharseHead {
      font-size: 20px;
    }

    .pharse {
      margin: 0;
      font-size: 16px;
    }

    .app {
      max-width: 500px;
      padding: 20px;
      display: flex;
      align-items: center;
      flex-direction: column;
      border-top: 3px solid rgb(16, 180, 209);
      background: rgb(31, 31, 31);
    }



    .commandBox {
      text-align: left;
      display: flex;
      width: 100%;
      flex-direction: column;
    }

    .commandHead {
      font-size: 18px;
      margin-bottom: 10px;
    }

    .commandRow {
      font-size: 16px;
      margin-top: 10px;
      display: flex;
    }

    .commandRow > span:first-child {
      font-weight: bold;
      width: 100px;
    }
    .commandRow > span {
      width: 400px;
    }

    .footer {
      margin-top: 20px;
      width: 100%;
      color: #6e6e6e;
      text-align: right;
    }
  </style>
</head>
<body>
  <div class="app">
    <div class="heading">
      <div class="phraseBox">
        <h1 class="pharseHead">👋안녕하세요! 🤖HR Office bot 입니다.</h1>
        <p class="pharse">
          저는 음성채널의 사람들을 무작위 팀으로 나누어 주는 봇입니다. 또한,
          DB에 저장된 데이터를 기반으로 개개인의 승률, 롤투력 등.. 다양한
          정보를 제공합니다.
        </p>
      </div>
    </div>
    <div class="commandBox">
      <div class="commandHead">🎉 아래 명령어들을 사용해 보세요.</div>
      <div class="commandRow">
        <span>!help</span>
        <span>명령어 목록을 불러옵니다.</span>
      </div>
      <div class="commandRow">
        <span>!5vs5</span>
        <span>채널에 속해있는 모두에게 푸시 알림을 보냅니다.</span>
      </div>
      <div class="commandRow">
        <span>!dice</span>
        <span>1~99 범위를 갖는 주사위를 굴립니다.</span>
      </div>
      <div class="commandRow">
        <span>!team</span>
        <span
          >현재 접속해 있는 음성채널의 인원들로 팀을 구성합니다. <br />이때,
          1팀 승리 / 2팀 승리 버튼을 통해 승패를 기록하기 위해서는 !register
          명령어를 먼저 입력해야 합니다.
        </span>
      </div>
      <div class="commandRow">
        <span>!top3</span>
        <span>롤투력 상위 3인을 표시합니다.</span>
      </div>
      <div class="commandRow">
        <span>!register</span>
        <span
          >음성 채널에 접속해있는 인원을 DB에 등록합니다.(약 1~2분 정도
          소요)</span
        >
      </div>
      <div class="commandRow">
        <span>!showAll</span>
        <span>DB에 저장된 모든 인원을 표시합니다.</span>
      </div>
      <div class="commandRow">
        <span>!show {name}</span>
        <span>name에 해당하는 인원을 표시합니다. (개발 중)</span>
      </div>
    </div>
    <div class="footer">🖥️Developed by. Junghyeon Jung, skfsjrnfl</div>
  </div>
</body>
</html>
`;
