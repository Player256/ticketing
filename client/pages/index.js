 import axios from "axios";
 
 const LandingPage = ({ currentUser }) => {
    console.log(currentUser);
    // axios.get('/api/users/currentuser').catch((err) => {
    //     console.log(err.message);
    //   });
   
    return <h1>Landing Page</h1>;
  };

  LandingPage.getInitialProps = async () => {
    if (typeof window === 'undefined') {
      
      const response = await axios.get("http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser",
      {
        headers: {
          Host: "ticketing.dev"
        }
      }
    );
  
      return response.data;
    } else {
      
      const { data } = await axios.get('/api/users/currentUser');
  
      return data;
    }
    return {};
  };

export default LandingPage;