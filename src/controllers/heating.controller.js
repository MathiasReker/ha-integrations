import { getHeating } from '../services/heating.service.js';

export const heating = async (req, res) => {
  try {
    const heatingStatus = await getHeating();
    res.json(heatingStatus);
  } catch (err) {
    console.log(err);
    res.status(500)
      .json({ errors: ['Internal Server Error.'] });
  }
};
