const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const { newsWebsites } = require('./webistes')

const app = express()
const port = 3000

// Middleware to parse JSON requests
app.use(express.json())

// Route for the homepage
app.get('/', (req, res) => {
  res.send('Welcome to the homepage!')
})

const headlines = []
const keyword = 'climate'

newsWebsites.forEach((item, index) => {
  // Replace with the actual URL you want to scrape
  axios.get(item.url).then(response => {
    const html = response.data
    const $ = cheerio.load(html)

    $(`a:contains(${keyword})`, html).each(function () {
      const title = $(this).text().trim()
      const url = $(this).attr('href')

      headlines.push({
        title,
        url,
        source: item.name
      })
    })
  })
})

// Route to scrape international online news headlines containing "climate crisis"
app.get('/news', async (req, res) => {
  try {
    // const { keyword } = req.params

    res.json({ headlines })
  } catch (error) {
    res
      .status(500)
      .json({ error: 'An error occurred while scraping news headlines' })
  }
})

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
