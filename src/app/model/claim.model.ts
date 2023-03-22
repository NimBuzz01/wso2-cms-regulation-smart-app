export class Claim {
  resourceType: any = "-";
  type!: {
    coding: [
      {
        system: any;
        code: any;
        display: any;
      }
    ];
  };
  use: any = "-";
  billablePeriod!: {
    start: any ;
    end: any;
  };
  insurer!: {
    reference: any;
    type: any;
    identifier: {
      use: any;
      value: any;
    };
  };
  provider!: {
    reference: any;
  };
  priority!: {
    coding: [
      {
        system: any;
        code: any;
        display: any;
      }
    ];
  };
  fundsReserve!: {
    coding: [
      {
        system: any;
        code: any;
        display: any;
      }
    ];
  };
  prescription!: {
    reference: any;
  };
  payee!: {
    type: {
      coding: {
        system: any;
        code: any;
        display: any;
      };
    };
    party: {
      reference: any;
    };
  };

  constructor() {
    this.type = {
      coding: [
        {
          system: "-",
          code: "-",
          display: "-",
        }
      ]
    }

    this.billablePeriod = {
      start: "-",
      end: "-",
    };

    this.insurer = {
      reference: "-",
      type: "-",
      identifier: {
        use: "-",
        value: "-",
      }
    };

    this.provider = {
      reference: "-"
    };

    this.priority = {
      coding: [
        {
          system: "-",
          code: "-",
          display: "-",
        }
      ]
    }

    this.fundsReserve = {
      coding: [
        {
          system: "-",
          code: "-",
          display: "-",
        }
      ]
    }

    this.prescription = {
      reference: "-"
    };

    this.payee = {
      type: {
        coding: {
          system: "-",
          code: "-",
          display: "-",
        }
      },
      party: {
        reference: "-",
      }
    }
  }
}

