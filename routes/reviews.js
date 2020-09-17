const express = require('express')
const Review = require('./../models/review')
const router = express.Router()

router.get('/new', (req, res) => {
    res.render('reviews/new', { review: new Review() })
})

router.get('/edit/:id', async (req, res) => {
    const review = await Review.findById(req.params.id)
    res.render('reviews/edit', { review: review })
})


router.get('/:slug', async (req, res) => {
    const review = await Review.findOne({ slug: req.params.slug })
    if (review == null) res.redirect('/')
    res.render('reviews/show', { review: review })
})

router.post('/', async (req, res, next) => {
    req.review = new Review()
    next()
}, saveReviewAndRedirect('new'))

router.put('/:id', async (req, res, next) => {
    req.review = await Review.findById(req.params.id)
    next()
}, saveReviewAndRedirect('edit'))


router.delete('/:id', async (req, res) => {
    await Review.findByIdAndDelete(req.params.id)
    res.redirect('/')
})

function saveReviewAndRedirect(path) {
    return async (req, res) => {
        let review = req.review
        review.title = req.body.title
        review.description = req.body.description
        review.markdown = req.body.markdown
        try {
            review = await review.save()
            res.redirect(`/reviews/${review.slug}`)
        } catch (e) {
            res.render(`reviews/${path}`, { review: review })
        }   
    }
}

module.exports = router