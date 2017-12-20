// Command shortcuts
// AT+ROLE=ROLE_PERIPHERAL
// AT+ROLE=ROLE_CENTRAL
// AT+MAC=?
// AT+CMODE=UNIQUE // Use this command to ensure that the bluetooth pairing is strictly one-one
// MAC Addresses, TX is peripheral, RX is central

// TX1: 0x38D269FDC0FE RX1: 0x506583874199 MAX
// TX2: 0x38D269FDBDDD RX2: 0x506583942E73 MLX

// TX3: 0x38D269FDB29F RX3: 0x38D269FDA973 MAX
// TX4: 0x38D269FDB614 RX4: 0x5065839429FB MLX

// MAX prototype: 0x50658399739E MAX prototype rx buddy: 0x506583997150

// For RX blunos, just upload a BareMinimum sketch from the example Basic codes

//#define TX1 1
//#define TX2 1
//#define TX3 1
#define TX4 1

long randNumber[3] = {80, 99, 370};
double temperature = 36.7;
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
}

void loop() {
  randomSeed(analogRead(A0));
  // put your main code here, to run repeatedly:
#if defined(TX1)
  randNumber[0] = random(70, 86);
  randNumber[1] = random(97, 101);
  Serial.println("P1HR: " + String(randNumber[0]) + " P1SPO2: " + String(randNumber[1]) + " "); // the single space after each numerical reading is essential!
#elif defined(TX2)
  randNumber[2] = random(366, 368);
  temperature = randNumber[2] / 10.0;
  Serial.println("P1T: " + String(temperature, 1) + " "); // the single space after each numerical reading is essential!
#elif defined(TX3)
  randNumber[0] = random(70, 86);
  randNumber[1] = random(97, 101);
  Serial.println("P2HR: " + String(randNumber[0]) + " P2SPO2: " + String(randNumber[1]) + " "); // the single space after each numerical reading is essential!
#elif defined(TX4)
  randNumber[2] = random(366, 368);
  temperature = randNumber[2] / 10.0;
  Serial.println("P2T: " + String(temperature, 1) + " "); // the single space after each numerical reading is essential!
#endif
  delay(1000);
}
