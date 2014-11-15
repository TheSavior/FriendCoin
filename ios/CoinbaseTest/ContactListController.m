//
//  ContactListController.m
//  CoinbaseTest
//
//  Created by Eli White on 11/15/14.
//  Copyright (c) 2014 Conrad Kramer. All rights reserved.
//

#import <Foundation/Foundation.h>
@import AddressBook;
#import "ContactListController.h"

//@interface ContactListController()
//- (void) sendResponse: (NSString *) response;
//@end

@implementation ContactListController

- (void) GetContactList {
    NSLog(@"Hello, World!");
    
    [self tryReadContactList];
}

- (void) sendResponse: (NSString *) response {
    if ([self.delegate respondsToSelector:@selector(contactListController:didGetContacts:)]) {
        NSLog(@"Go");
        [self.delegate contactListController:self didGetContacts:response];
        
    }
}


- (void)readContactList {
    ABAddressBookRef addressBook = ABAddressBookCreateWithOptions(NULL, NULL);
    CFArrayRef people = ABAddressBookCopyArrayOfAllPeople(addressBook);

    CFIndex numberOfPeople = ABAddressBookGetPersonCount(addressBook);

    NSMutableDictionary *myDictionary = [[NSMutableDictionary alloc] init];

    for(int i = 0; i < numberOfPeople; i++) {

        ABRecordRef person = CFArrayGetValueAtIndex( people, i );

        NSString *firstName = (__bridge NSString *)(ABRecordCopyValue(person, kABPersonFirstNameProperty));
        NSString *lastName = (__bridge NSString *)(ABRecordCopyValue(person, kABPersonLastNameProperty));
        NSString *name = [NSString stringWithFormat:@"%@ %@", firstName, lastName];

//        kABPersonCompositeNameFormatFirstNameFirst

        ABMultiValueRef phoneNumbers = ABRecordCopyValue(person, kABPersonPhoneProperty);

        if(ABMultiValueGetCount(phoneNumbers) >= 1) {
            NSString *phoneNumber = (__bridge_transfer NSString *) ABMultiValueCopyValueAtIndex(phoneNumbers, 0);
            [myDictionary setObject:name  forKey:phoneNumber];
        }
    }
    NSError *error = nil;
    NSData *json;

    // Dictionary convertable to JSON ?
    if ([NSJSONSerialization isValidJSONObject:myDictionary])
    {
        // Serialize the dictionary
        json = [NSJSONSerialization dataWithJSONObject:myDictionary options:NSJSONWritingPrettyPrinted error:&error];

        // If no errors, let's view the JSON
        if (json != nil && error == nil)
        {
            NSString *jsonString = [[NSString alloc] initWithData:json encoding:NSUTF8StringEncoding];

            NSLog(@"JSON: %@", jsonString);
            [self sendResponse:jsonString];
            return;
        }
        else {
            [self sendResponse:@"{}"];
            return;
        }
    }
    
    [self sendResponse:@"{}"];
    return;
}

- (void)tryReadContactList {
    CFErrorRef error = nil;
    ABAddressBookRef addressBook = ABAddressBookCreateWithOptions(NULL, &error);
    if (addressBook) {
        ABAddressBookRequestAccessWithCompletion(addressBook, ^(bool granted, CFErrorRef error) {
            if (granted) {

                CFArrayRef people = ABAddressBookCopyArrayOfAllPeople(addressBook);
                for (CFIndex idx = 0; idx < CFArrayGetCount(people); idx++) {
                    ABRecordRef person = CFArrayGetValueAtIndex(people, idx);
                    NSString *name = (__bridge NSString *)ABRecordCopyCompositeName(person);
                    NSLog(@"SOMEONE NAMED %@", name);
                }
            } else {
                [self sendResponse:@"{}"];
                // Send error
            }
        });
    } else {
        [self sendResponse:@"{}"];
        // Send error
    }


    if (ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusDenied ||
        ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusRestricted){
        //1
        NSLog(@"Denied");
        return [self sendResponse:@"{}"];
    } else if (ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusAuthorized){
        //2
        NSLog(@"Authorized");

        return [self readContactList];
    } else{ //ABAddressBookGetAuthorizationStatus() == kABAuthorizationStatusNotDetermined
        //3
        NSLog(@"Not determined");

        ABAddressBookRequestAccessWithCompletion(ABAddressBookCreateWithOptions(NULL, nil), ^(bool granted, CFErrorRef error){
            if (!granted){
                //4
                NSLog(@"Just denied");
                return [self sendResponse:@"{}"];
            }
            //5
            NSLog(@"Just authorized");

            return [self readContactList];
            

        });
    }

    return [self sendResponse:@"{}"];
}

@end
