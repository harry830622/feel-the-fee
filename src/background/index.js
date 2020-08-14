import axios from 'axios';

axios.get(`${process.env.ORIGIN}/api/gas`).then((res) => {
  console.log(res.data);
});
