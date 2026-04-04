import app from './app';

const port = 5000;

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Congratulations! MediStore Server is at port ${port}`);
    });
  } catch (err) {
    console.log(err);
  }
}

main();