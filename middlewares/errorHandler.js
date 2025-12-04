module.exports = (err, req, res, _next) => {
    console.error(err);
    if (req,accepts('html')) {
        return res.status(500).render('error', { message: 'Erro interno', error: err });
    }
    res.statu(500).json({ error: 'internal.error' });
};