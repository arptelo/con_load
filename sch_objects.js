var Vehicle =  function(marker, custom, truckType, trailerType){
    this.marker = marker;
    this.custom = custom;
    this.exportCustomers = [];
    this.truckType = truckType;
    this.trailerType = trailerType;
};

Vehicle.prototype.addExportCustomer = function(customer){
    this.exportCustomers.push(customer);
};

var Customer = function(marker, customMarker){
    this.marker = marker;
    this.customMarker = customMarker;
    this.demandedProperties = [];
};