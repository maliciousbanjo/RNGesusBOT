# RNGesusBot Change Log

All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## [4.0.0] - Current

- Completely updated to support DiscordJS v12
- Removal of `!quote` command now that Discord natively supports replies.
- Major refactoring under the hood
- `!info` -> `!help`
  - Use `!help [command name]` to get info on a specific command
  - Also refactored how the message is assembled
- Changed terminology from "emote" to "emoji"
  - Because that's what Discord officially uses
- More robust permission-checking added
- Commands organized into categories

## [3.0.0] - Released

- `message` metadata is now being collected
  - `timestamp`, `author`, and `channel` are now being collected for
    use with metrics reporting (coming soon!)
  - **ALL** message/emote history has been gathered
- New command `!posts`
  - Lists the top 10 posters in the server
- Users and Emotes are automatically scanned on startup
- Multiple unique emotes can be detected/updated in a single message
- Removal of Cosmic Kek, press F to pay respects
- Updates to `!server` command
  - "Total Messages" has been added
  - "Most Recent Kekkers" has been removed
- Updates to `!user` command
  - Added "Kek Count"
  - Added "Kek Ratio"
- Formatting updates to `!info`, `!user`, and `!server`

## [2.6.0] - Released

- Introducing quotes
  - `!quote <message Id>` to quote a previous post
  - For easier use, turn on Developer Mode to unlock "Copy ID" with a right click

## [2.5.2] - Released

- Added a private command to see emote count

## [2.5.1] - Released

- Public debut of Platelet Kek
- Bugfixes, operational changes to Platelet Kek

## [2.5.0] - Released

- Deprecated updateKek and abstracted into separated methods
- New kek added :eyes:

## [2.4.0] - Released

- Emote leaderboards

## [2.3.0] - Released

- New users are automatically added to the "Disciple" role
- Testing feature (for me, and only me)

## [2.2.0] - Released

- Emote tracking
- Server stats

## [2.1.0] - Released

- User Stats
  - Message count
  - Golden and Cosmic Kek count

## [2.0.0] - Released

- Complete ES6 refactor
  - It's so _clean!_

## [1.5.0] - Released

- Spooky.

## [1.4.0] - Released

- MHW Weakness Chart

## [1.3.0] - Released

- Introducing random insults

## [1.2.1] - Released

- Renamed britbong command to pilgrim

## [1.2.0] - Released

- Help message
- britbong command

## [1.1.1.] - Released

- Bugfix on scheduler

## [1.1.0] - Released

- It is Wednesday, my dudes.

## [1.0.1] - Released

- Dice roll command
- Muff and Ffum commands
- Golden Kek

## [1.0.0] - Released

- Simple functioning interaction, absolutely nothing added.
