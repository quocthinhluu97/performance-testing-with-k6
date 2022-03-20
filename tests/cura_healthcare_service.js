// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check } from 'k6'
import http from 'k6/http'
import { randomlyPickValueFromObject } from '../utils.js'

export const options = { vus: 10, duration: '10s' }

const facility = {
 SEOUL: 'Seoul CURA Healthcare Center',
 HONGKONG: 'Hongkong CURA Healthcare Center',
 TOKYO: 'Tokyo CURA Healthcare Center',
};

const program = {
  MEDICARE: 'Medicare',
  MEDICAID: 'Medicaid',
  NONE: 'None',
};

export default function main() {
  let response

  group('Authenticate with default credentials', function() {
    response = http.post('https://katalon-demo-cura.herokuapp.com/authenticate.php',
      {
        username: 'John Doe',
        password: 'ThisIsNotAPassword',
      }
    );
  });

  group('Book an appointment', function () {
    response = http.post(
      'https://katalon-demo-cura.herokuapp.com/appointment.php',
      {
        facility: randomlyPickValueFromObject(facility),
        programs: randomlyPickValueFromObject(program),
        hospital_readmission: Math.random() < 0.5 ? "Yes" : "No",
        visit_date: '05/04/2022',
        comment: 'CURA health service demo',
      },
    );
    console.debug(JSON.stringify(response, null, "  "));
  });

  // Add sleep so that server can cope with the traffic
  sleep(1)
}