const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_API_SECRET = import.meta.env.VITE_PINATA_API_SECRET;

if (!PINATA_API_KEY || !PINATA_API_SECRET) {
  console.warn('Pinata API keys not configured');
}

export interface IPFSUploadResult {
  IpfsHash: string;
  PinSize: number;
  Timestamp: string;
}

export const uploadToIPFS = async (file: File): Promise<IPFSUploadResult> => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error('Pinata API keys not configured');
  }

  const formData = new FormData();
  formData.append('file', file);

  const metadata = JSON.stringify({
    name: file.name,
    keyvalues: {
      platform: 'AgroChain',
      timestamp: new Date().toISOString(),
    },
  });
  formData.append('pinataMetadata', metadata);

  const options = JSON.stringify({
    cidVersion: 0,
  });
  formData.append('pinataOptions', options);

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw error;
  }
};

export const uploadJSONToIPFS = async (jsonData: any): Promise<IPFSUploadResult> => {
  if (!PINATA_API_KEY || !PINATA_API_SECRET) {
    throw new Error('Pinata API keys not configured');
  }

  try {
    const response = await fetch('https://api.pinata.cloud/pinning/pinJSONToIPFS', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'pinata_api_key': PINATA_API_KEY,
        'pinata_secret_api_key': PINATA_API_SECRET,
      },
      body: JSON.stringify({
        pinataContent: jsonData,
        pinataMetadata: {
          name: `AgroChain-${Date.now()}.json`,
          keyvalues: {
            platform: 'AgroChain',
            timestamp: new Date().toISOString(),
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error uploading JSON to IPFS:', error);
    throw error;
  }
};

export const getIPFSUrl = (hash: string): string => {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
};