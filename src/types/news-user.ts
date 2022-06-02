export type NewsUser = {
  Id: string;
  Name: string;
  Username__c: string;
  Password__c: string;
  Profile__c: "Subbed" | "Manager" | "Admin";
};
