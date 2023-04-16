import axios from 'axios';
import FormData from 'form-data';

const pinataApiKey = process.env.REACT_APP_PINATA_KEY;
const pinataSecretApiKey = process.env.REACT_APP_PINATA_SECRET;


export const uploadJSONToIPFS = async (JSONBody) => {
  const url = 'https://api.pinata.cloud/pinning/pinJSONToIPFS';

  const headers = {
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  return axios
    .post(url, JSONBody, { headers })
    .then(function (response) {
      return {
        success: true,
        pinataURL: 'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export async function getJSONFromIPFS(hash) {
  const url = `https://gateway.pinata.cloud/ipfs/${hash}`;

  return axios
    .get(url)
    .then(function (response) {
      return { success: true, data: response.data };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const uploadFileToIPFS = async (file) => {
  const url = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

  let data = new FormData();
  data.append('file', file);

  const metadata = JSON.stringify({
    name: 'testname',
    keyvalues: {
      exampleKey: 'exampleValue',
    },
  });
  data.append('pinataMetadata', metadata);

  const pinataOptions = JSON.stringify({
    cidVersion: 0,
    customPinPolicy: {
      regions: [
        {
          id: 'FRA1',
          desiredReplicationCount: 1,
        },
        {
          id: 'NYC1',
          desiredReplicationCount: 2,
        },
      ],
    },
  });
  data.append('pinataOptions', pinataOptions);

  const headers = {
    'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  return axios
    .post(url, data, {
      headers,
      maxBodyLength: 'Infinity',
    })
    .then(function (response) {
      console.log('image uploaded', response.data.IpfsHash);
      return {
        success: true,
        pinataURL: 'https://gateway.pinata.cloud/ipfs/' + response.data.IpfsHash,
      };
    })
    .catch(function (error) {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};

export const getPinList = async () => {
  const url = 'https://api.pinata.cloud/data/pinList?pageLimit=1';
  const headers = {
    pinata_api_key: pinataApiKey,
    pinata_secret_api_key: pinataSecretApiKey,
  };

  return axios
    .get(url, { headers })
    .then((response) => {
      if (response.status === 200) {
        return response.data.rows.map((row) => row.ipfs_pin_hash);
      } else {
        throw new Error('Failed to get Pin List from Pinata');
      }
    })
    .catch((error) => {
      console.log(error);
      return {
        success: false,
        message: error.message,
      };
    });
};