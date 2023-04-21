# HR-discord-bot

<img src="https://user-images.githubusercontent.com/68142773/231139544-672da8d4-28ca-4ca9-b757-82a8d3019ff2.png"/>

## Introduction
Discord.js 라이브러리를 이용해 개발한 Discord 봇입니다. 이 봇은 게임과 같이 팀을 구성해 대결할 때 팀을 구성하거나, 결과를 기록하는 것을 돕기 위해 개발되었습니다.

## Developers
| 정정현 | 김도환 |
|:---:|:---:|
|<img width="180" src="https://user-images.githubusercontent.com/68142773/231140917-7af68456-d97e-4dd8-bf03-cf4ac9a2f5c9.png"/>|<img width="180" src="https://user-images.githubusercontent.com/68142773/231140998-843f9e71-5618-4b0d-b5f6-2e07d28ba101.png"/>|
| **GitHub**: [luckjjh](https://github.com/luckjjh) | **GitHub**:  [skfsjrnfl](https://github.com/skfsjrnfl) |


## Development Environment
* Node.js(v16.16.0)
* Database: Notion API
* 서비스 배포 환경: [discloud](https://discloudbot.com/)
```
  "dependencies": {
    "@notionhq/client": "^1.0.1",
    "discord.js": "^14.8.0"
  }
```
## File Structure
```
hr-bot
|-- README.md
|-- assets
|   `-- icon.png
|-- command.js
|-- config-dev.json
|-- config.json
|-- db_api.js
|-- db_key.js
|-- discloud.config
|-- index.js
|-- node_modules
```

## Features
| Command | Details |
|:---:|---|
|!help| 아래 이미지와 같은 명령어 목록을 불러옵니다. <br><img src="https://user-images.githubusercontent.com/68142773/231148713-66f4097b-408e-4702-b941-5d9a5c0c726e.png" width = "300"/> |
|!5vs5| 채널에 속해있는 모두에게 푸시 알림을 보내고, 참석 여부를 반응 버튼으로 체크합니다. |
|!dice| 1~99 범위를 갖는 주사위를 굴립니다. |
|!team| 현재 접속해 있는 음성채널의 인원들로 팀을 구성합니다. <br> <img src="https://user-images.githubusercontent.com/68142773/231149848-dd9cdba3-680c-4f6c-a225-5ef0cee9153e.png" width = "500"/> <br>cf. 이때, 1팀 승리 / 2팀 승리 버튼을 통해 승패를 기록하기 위해서는 !register 명령어를 먼저 입력해야 합니다. |
|!register|음성 채널에 접속해있는 인원을 DB에 등록합니다.(약 1~2분 정도 소요)|
|!showAll|DB에 저장된 모든 인원을 표시합니다.|
|!show {name}|name에 해당하는 인원을 표시합니다.|
|!top3|랭킹 상위 3인을 표시합니다.|

## References
* [Discord.js Docs](https://discord.js.org/)
* [Notion API Docs](https://developers.notion.com/)
