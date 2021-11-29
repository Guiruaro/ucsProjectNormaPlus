const Spot = require('../models/Spot');
const User = require('../models/User');

module.exports = {
    async index(req, res){
        const { cat } = req.query;
        const { spot_id } = req.params;
        if (spot_id) {
          const spots = await Spot.find({ _id: spot_id });
          console.log(1,spots);
          return res.json(spots);
        } 
        
        const spots = await Spot.find({ cats: cat });
        console.log(2,cat);
        return res.json(spots);
        
    },

    async store(req, res){
        const { filename } = req.file;
        const { name, cats, price, desc } = req.body;
        const { user_id } = req.headers;

        const user = await User.findById(user_id);

        if(!user){
            return res.status(400).json({ error: 'Usuário não existe'})
        }

        const spot = await Spot.create({
            user: user_id,
            thumbnail: filename,
            name,
            cats: cats.split(',').map(cat => cat.trim()),
            price,
            desc
        })

        return res.json(spot);
    },

    async delete(req, res){
        const { spot_id } = req.params;

        const spot = await Spot.findById(spot_id);

        if(!spot){
            return res.status(400).json({ error: 'Spot não existe'})
        }
        
        spotDel = await Spot.deleteOne({
            _id: spot_id
        })

        return res.json(spot);
    },
}