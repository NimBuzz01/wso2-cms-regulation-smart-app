export class Eob {
  resourceType: any = "-";
  id: any = "-";
  status: any = "-";
  type: any = "-";
  use: any = "-";
  patient: any = "-";
  billablePeriod!: {
    start: any;
    end: any;
  };
  created: any = "-";
  enterer!: {
    reference: any;
  };
  fundsReserveRequested: any = "-";
  insurer: any = "-";
  provider: any = "-";
  priority: any = "-";
  prescription!: {
    reference: any
    type: any;
  };
  payee: any = "-";
  claim: any = "-";
  claimResponse: any = "-";
  outcome: any = "-";
  disposition: any = "-";
  total!: {
    category: {
      coding: {
        system: any;
        code: any;
        display: any;
      };
    };
    amount: {
      value: any;
      currency: any;
    };
  };

  constructor() {
    this.billablePeriod = {
      start: "-",
      end: "-",
    };

    this.enterer = {
      reference: "-",
    };

    this.billablePeriod = {
      start: "-",
      end: "-",
    };

    this.prescription = {
      reference: "-",
      type: "-",
    };

    this.total = {
      category: {
        coding: {
          system: "-",
          code: "-",
          display: "-",
        }
      },
      amount: {
        value: "-",
        currency: "-",
      }
    };
  }
}
