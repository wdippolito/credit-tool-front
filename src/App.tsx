import React, { useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import ThresholdBar from './ThresholdBar';
import BarChart from './BarChart';


//interface to store data returned from api request 
interface Data {
  loan_status: string;
  position: number;
  probability: number;
}

const apiUrl = process.env.REACT_APP_API_URL;


//main app which has a data entry and data visualization section
//request are made via axios to an api hosted on a flask server
function App() {
  const [formValues, setFormValues] = useState({
    Balance_To_Credit_PCT: '',
    Total_Credit_SUM: '',
    Satisfactory_Lines_COUNT: '',
    Satisfactory_PCT: '',
    Bad_lines_Cnt_24_Months: '',
    Inquiry_Count_24_Months: '',
    Lines_50_PCT_Utilized_COUNT: '',
    Delinquent_90_day_Cnt24: '',
    Open_Lines_Count: '',
    Balance_All_Lines: ''
  });
  const defaultData: Data = {
    loan_status: '', // default value for string
    probability: 0,  // default value for number
    position: 0      // default value for number
    // Set default values for other properties as needed
};
  const [responseData, setResponseData] = useState('');
  const [parsedData, setParsedData] = useState<Data>(defaultData);
  const [probabilityGood, setProbability] = useState<number>(0);
  const [borrowerPosition , setPosition] = useState<number>(0);
  const chartValues: number[] = [0.03096613, 0.05566185, 0.10926337, 0.11870438, 0.03117417, 0.14284148,
    0.35043688, 0.13979796, 0.20735669, 0.07555408, 0.08870812, 0.25208311,
    0.31902907, 0.31599976, 0.47640015, 0.43624461, 0.20491187, 0.41718272,
    0.0728687, 0.34501306, 0.66939204, 0.42028498, 0.11645512, 0.34092205,
    0.07701127, 0.21521732, 0.079575, 0.17817085];


  // Update state when input fields change
  const handleChange = (event: { target: { name: any; value: any; }; }) => {
    const { name, value } = event.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    const payload = {
      instances: [Object.values(formValues)]
    };
    console.log('payload: ', payload);
    console.log(apiUrl)
    runPythonScript(payload);

  };


//handler for communication with flask backend
const runPythonScript = async (payload: { instances: string[][]; }) => {
  try {
    const response = await axios.post(`${apiUrl}/runscript`, {payload});
    console.log(response.data);
    const dataString = JSON.stringify(response.data, null, 2)
    setResponseData(dataString);
    const responseData = JSON.parse(dataString);
    setParsedData(JSON.parse(dataString));
    setProbability(responseData.probability);
    setPosition(responseData.position);
  } catch (error) {
    console.error(error);
  }
};

  return (
    <div className="App">
      <header className="App-header">
      <p>
          Enter User Data for Credit Assesment:
      <br />   
      </p>

        {/* Form with 10 input fields */}
        <form onSubmit={handleSubmit}>
          {Object.keys(formValues).map((key, index) => (
            <div key={key}>
              <input
                key={key}
                type="text"
                name={key}
                value={(formValues[key as keyof typeof formValues])}
                onChange={handleChange}
                placeholder={key}
              />
              <br />
            </div>
          ))}
          <br />
          <button type="submit">Submit</button>
          <br />
          <br />
        </form>


        <div>
          <strong>Loan Status:</strong>
        </div>
         {/* Display the response data */}
         <div className="response-data">
          {parsedData && <pre>{parsedData.loan_status}</pre>}
          </div>
      </header>

      <div className="visualization">
          {/* visualization elements */}
          <p>Visualizations</p>
          <h2>Predicted Probabilty of Good Loan - 96% percent required for approval:</h2>
            <ThresholdBar percentage={probabilityGood} />
          <h2>Compared to other Borrowers:</h2>          
            <ThresholdBar percentage={borrowerPosition} />
            <h2>Feature Coeffecient Graph (top 10 in red)</h2>
              <BarChart values={chartValues} />

        </div>
    );
    </div>
  );
}

export default App;
