import { BasePage, IPluginDecorator, LocatorMap } from '../utils'
import { Notification as NotificationLocators } from '../../locators/1.61.0'
import { ChainablePromiseElement } from 'webdriverio';

/**
 * Available types of notifications
 * @hidden
 */
export enum NotificationType {
    Info = 'info',
    Warning = 'warning',
    Error = 'error',
    Any = 'any'
}

export interface Notification extends IPluginDecorator<typeof NotificationLocators> {}
/**
 * Abstract element representing a notification
 *
 * @category Workbench
 */
export abstract class Notification extends BasePage<typeof NotificationLocators> {
    /**
     * Get the message of the notification
     * @returns Promise resolving to notification message
     */
    async getMessage(): Promise<string> {
        return await this.message$.getText();
    }

    /**
     * Get the type of the notification
     * @returns Promise resolving to NotificationType
     */
    async getType(): Promise<NotificationType> {
        const iconType = await this.icon$.getAttribute('class');
        if (iconType.indexOf('icon-info') > -1) {
            return NotificationType.Info;
        } else if (iconType.indexOf('icon-warning') > -1) {
            return NotificationType.Warning;
        } else {
            return NotificationType.Error;
        }
    }

    /**
     * Get the source of the notification as text
     * @returns Promise resolving to notification source
     */
    async getSource(): Promise<string> {
        await this.expand();
        return await this.source$.getAttribute('title');
    }

    /**
     * Find whether the notification has an active progress bar
     * @returns Promise resolving to true/false
     */
    async hasProgress(): Promise<boolean> {
        const klass = await this.progress$.getAttribute('class');
        return klass.indexOf('done') < 0;
    }

    /**
     * Dismiss the notification
     * @returns Promise resolving when notification is dismissed
     */
    async dismiss(): Promise<void> {
        const btn = await this.dismiss$
        await btn.click()
        await btn.waitForDisplayed({ reverse: true, timeout: 2000 })
    }

    /**
     * Get the action buttons of the notification as an array
     * of NotificationButton objects
     * @returns Promise resolving to array of NotificationButton objects
     */
    async getActions(): Promise<NotificationButton[]> {
        const buttons: NotificationButton[] = [];
        const elements = await this.actions$
            .$$(this.locators.action);

        for (const button of elements) {
            buttons.push(await new NotificationButton(
                this.locatorMap,
                await button.getAttribute(this.locators.actionLabel)
            ).wait());
        }
        return buttons;
    }

    /**
     * Click on an action button with the given title
     * @param title title of the action/button
     * @returns Promise resolving when the select button is pressed
     */
    async takeAction(title: string): Promise<void> {
        await new NotificationButton(
            this.locatorMap,
            title
        ).elem.click();
    }

    /**
     * Expand the notification if possible
     */
    async expand(): Promise<void> {
        await this.elem.moveTo()
        const exp = await this.expand$$;
        if (exp[0]) {
            await exp[0].click();
        }
    }
}

/**
 * Notification displayed on its own in the notifications-toasts container
 *
 * @category Workbench
 */
export class StandaloneNotification extends Notification {
    /**
     * @private
     */
    public locatorKey = 'Notification' as const

    constructor(
        locators: LocatorMap,
        notification: ChainablePromiseElement<WebdriverIO.Element>
    ) {
        super(locators, notification, locators['Notification'].standaloneContainer as string);
    }
}

/**
 * Notification displayed within the notifications center
 *
 * @category Workbench
 */
export class CenterNotification extends Notification {
    /**
     * @private
     */
    public locatorKey = 'Notification' as const

    constructor(
        locators: LocatorMap,
        notification: ChainablePromiseElement<WebdriverIO.Element>
    ) {
        super(locators, notification);
    }
}

interface NotificationButton extends IPluginDecorator<typeof NotificationLocators> {}
/**
 * Notification button
 *
 * @category Workbench
 */
 class NotificationButton extends BasePage<typeof NotificationLocators> {
    /**
     * @private
     */
    public locatorKey = 'Notification' as const
    private title: string;

    constructor(
        locators: LocatorMap,
        title: string
    ) {
        super(locators, (locators['Notification'].buttonConstructor as Function)(title));
        this.title = title;
    }

    getTitle(): string {
        return this.title;
    }
}