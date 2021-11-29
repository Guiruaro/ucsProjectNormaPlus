const { store } = require("./SessionController");

const Booking = require('../models/Booking');

module.exports = {
    async store(req, res ){
        const { booking_id } = req.params;

        const booking = await Booking.findById(booking_id).populate('spot');

        booking.approved = true;

        await booking.save();

        const bookigUserSocket = req.connectedUsers[booking.user];

        if (bookigUserSocket) {
            req.io.to(bookigUserSocket).emit('booking_response', booking);
            //console.log(bookigUserSocket);
        }

        return res.json(booking);
    }
};