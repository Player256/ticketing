import buildClient from "../api/build-client";

const LandingPage = ({ currentUser }) => {
  
  // axios.get('/api/users/currentuser').catch((err) => {
  //     console.log(err.message);
  //   });

  return currentUser ? (
    <h1>You are now logged in</h1>
  ) : (
    <h1>You are now not logged in</h1>
  );
};

LandingPage.getInitialProps = async (context) => {
  console.log('Landing Page!!!');
  const { data } = await buildClient(context).get("/api/users/currentUser");

  return data;
};

export default LandingPage;
