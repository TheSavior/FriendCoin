//
//  ContactList.h
//  CoinbaseTest
//
//  Created by Eli White on 11/15/14.
//  Copyright (c) 2014 Conrad Kramer. All rights reserved.
//


@class ContactListController;

@protocol ContactListControllerDelegate <NSObject>
@optional
- (void)contactListController:(ContactListController *)contactListController didGetContacts:(NSString *)string;
- (void)contactListControllerDidCancel:(ContactListController *)contactListController;
@end


@interface ContactListController : NSObject
@property (nonatomic, weak) id<ContactListControllerDelegate> delegate;

- (void) GetContactList;
@end