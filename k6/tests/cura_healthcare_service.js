// Creator: k6 Browser Recorder 0.6.2

import { group, sleep } from 'k6'
import http from 'k6/http'
import { randomlyPickValueFromObject, checkStatus } from '/app/utils.js'

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

const baseURL = 'https://katalon-demo-cura.herokuapp.com';

export default function cura_healthcare_service() {
  let response

  group('Authenticate with default credentials', function() {
    response = http.post(`${baseURL}/authenticate.php`,
      {
        username: 'John Doe',
        password: 'ThisIsNotAPassword',
      }
    );

    checkStatus({
      response: response,
      expectedStatus: 200,
      printOnError: false,
      failOnError: false,
    });

    sleep(3);
  });

  group('Book an appointment', function () {
    response = http.post(
      `${baseURL}/appointment.php`,
      {
        facility: randomlyPickValueFromObject(facility),
        programs: randomlyPickValueFromObject(program),
        hospital_readmission: Math.random() < 0.5 ? "Yes" : "No",
        visit_date: '05/04/2022',
        comment: 'CURA health service demo',
      },
    );
    console.debug(JSON.stringify(response, null, "  "));

    checkStatus({
      response: response,
      expectedStatus: 200,
      printOnError: true,
      failOnError: true,
    });

    sleep(3);
  });
}
