import fastify from 'fastify'

const app = fastify()

app.get('/', () => {
  return ('Hello Im data api!! ')
})

app.listen({
  port:3030,
  host: 'localhost'
}).then(() => {
  console.log(` Server running!`)
})