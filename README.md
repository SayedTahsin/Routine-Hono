# Routine-Hono
Build with Hono.js in Cloudflare-workers environment. Deployed on Cloudflare-workers. Used D1 Sqlite Database, Bun as Package Manager, and Cron type trigger events for scheduling tasks.

<a href="https://routine-lemon.vercel.app/">Front-end Deployed on Vercel</a>

### Feature
- Firebase user authentication
- JWT token based session manange
- Add Task with Different Pre-defined(weekdays) and custom categories.
- Edit/Delete tasks
- Resets Tasks Based on Schedule
- Calculate Consistency Percentage

 <a href="https://github.com/SayedTahsin/Hono-Bun-Mongo">Same project build with Hono.js on Bun Enviromnet & Used MongoDb</a>
 <br>
 <a href="https://github.com/SayedTahsin/Task-App-Backend">Same project build with Express.js & used MongoDb and Supabase Database</a>

Run locally:
- install bun if you want to use bun as package manager (recommended but optional)
- install wrangler for D1 database, cloudflare-workers runtime and deploy
```bash 
$ bun add -g wrangler
```
- clone repo
```bash
$ git@github.com:SayedTahsin/Routine-Hono.git
```
- create and execute D1 database: After creating db, you will get some valiable,
  copy paste these variable in wrangler.toml file then apply. (<a href="https://github.com/SayedTahsin/Cloudflare-Hono-D1">check this repo for understanding D1</a>)
```
$ wrangler d1 create <db-name>
$ wrangler d1 execute <db-name> --local --file=./schema.sql
```
- Run
```bash
$ bun install
$ bun run dev
```
- Deploy
```
$ bun run deploy
```



## TODO's
- [x] write Task API
- [x] write Note API
- [x] write User API
- [x] write Auth Route
- [x] Auth Middleware
- [x] cron triggers
- [x] deploy on Cloudflare-workers
- [x] fix CORS error
- [ ] fix Cookies Issue
