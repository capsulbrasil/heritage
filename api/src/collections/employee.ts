import { extendEmployeeCollection } from "../../.aeria/out/collections/employee.mjs";

export const employee = extendEmployeeCollection({
    description: {
      formLayout: {
        fields: {
          exit_date: {
            if: {
              not: {
                operator: "equal",
                term1: "employee_status",
                term2: true
              }
            }
          }
        }
      }
    }
  });