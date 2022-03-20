// Creator: k6 Browser Recorder 0.6.2

import { sleep, group, check } from 'k6'
import http from 'k6/http'
import { Rate } from 'k6/metrics'
import { randomlyPickValueFromObject } from '/utils.js'

const errorRate = new Rate("error_rate");

export const options = {
  stages: [
    // Ramp-up 
    { duration: '5s', target: 10 },

    // Stay at 10 VUs for 5s
    { duration: '5s', target: 10 },

    // Ramp-down
    { duration: '5s', target: 0 },
  ],
  thresholds: {
    // More than 10% of error be considered as fail
    error_rate: ["rate<0.1"],
  }
}

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

export default function main() {
  let response

  group('Authenticate with default credentials', function() {
    response = http.post(`${baseURL}/authenticate.php`,
      {
        username: 'John Doe',
        password: 'ThisIsNotAPassword',
      }
    );
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

    let success = check(response, {
        "status is 200": r => r.status === 200,
      }
    );

    if (!success) {
      errorRate.add(true);
    } else {
      errorRate.add(false);
    }
  });

  // Add sleep so that server can cope with the traffic
  sleep(1)
}
