export class USBDevice {
  constructor() {
    this.device = null;
  }

  async connect() {
    try {
      this.device = await navigator.usb.requestDevice({
        filters: [{ vendorId: 0x2E8A }] // Raspberry Pi Pico vendor ID
      });
      await this.device.open();
      await this.device.selectConfiguration(1);
      await this.device.claimInterface(0);
      return true;
    } catch (error) {
      console.error('USB Connection error:', error);
      return false;
    }
  }

  async writeToDevice(data) {
    if (!this.device) return false;
    try {
      const encoder = new TextEncoder();
      const dataArray = encoder.encode(data);
      await this.device.transferOut(1, dataArray);
      return true;
    } catch (error) {
      console.error('Write error:', error);
      return false;
    }
  }

  async readFromDevice() {
    if (!this.device) return null;
    try {
      const result = await this.device.transferIn(1, 64);
      const decoder = new TextDecoder();
      return decoder.decode(result.data);
    } catch (error) {
      console.error('Read error:', error);
      return null;
    }
  }

  async disconnect() {
    if (!this.device) return;
    try {
      await this.device.close();
      this.device = null;
    } catch (error) {
      console.error('Disconnect error:', error);
    }
  }
}
