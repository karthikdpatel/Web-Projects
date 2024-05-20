import axios from "axios";

export class APIService {
  private readonly isDevMode: boolean;
  constructor() {
    this.isDevMode = process.env.NODE_ENV === "development";
  }

  async callInternalAPI(
    endpoint: string,
    params?: { [x: string]: any },
    headers?: { [x: string]: any },
    progressCallback?: (progress: number) => void,
  ) {
    if (this.isDevMode) {
      endpoint = "http://localhost:3000" + endpoint;
    }

    const res = await axios.get(endpoint, {
      params: params,
      headers: headers,
      onDownloadProgress(progressEvent) {
        if (progressCallback) {
          progressCallback(progressEvent.progress ?? 1);
        }
      },
    });

    if (res.status < 400) {
      return res.data;
    } else {
      throw new Error();
    }
  }

  async callExternalAPI(
    url: string,
    params?: { [x: string]: any },
    headers?: { [x: string]: any },
    progressCallback?: (progress: number) => void,
  ) {
    const res = await axios.get(url, {
      params: params,
      headers: headers,
      onDownloadProgress(progressEvent) {
        if (progressCallback) {
          progressCallback(progressEvent.progress ?? 1);
        }
      },
    });

    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error();
    }
  }
}
