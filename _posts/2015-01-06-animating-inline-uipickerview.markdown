---
layout: post
title:  "Animating Inline UIPickerView"
date:   2015-01-07 21:44:46
categories: iOS
short: "Implementing an Inline Picker ala the Date Picker in iOS Calendar"
summary: "Turns out using a UIPickerView like the date picker in the iOS Calendar is pretty easy. Here's how."
---
<img class="pull-right" style="width: 35%; margin-top: -10px;" src="/assets/img/posts/trip_view.png">
In the TripTrax app, you can choose a trip type. The options are charitable, personal and business, and the default is business. I have one
table view cell that displays the type, and then the picker view is hidden in a table view cell below that. When you tap the type area, the
picker view slides into view. Here's how I solved it:

<h2>Add cell to table in storyboard</h2>

Add a UITableViewCell below the cell that displays whatever the current option is. Place a UIPickerView in
the table cell. The picker view should be pinned to the sides and top of the content view. I think the fastest
way of doing that is to select the picker view, go to Editor->Pin and choose appropriately there. It's
also important to set the table view cell row height to 0:<br>
<img width="190" src="/assets/img/posts/table_cell_settings.png"><br>
The picker view should be set to hidden:<br>
<img width="190" src="/assets/img/posts/pickerview_view_settings.png">

<h2>Add code to the view controller</h2>

Add a boolean typePickerShouldOpen, to keep track of if the picker should be opened or closed when you tap the
type chooser button. The button is hooked up to an IBAction that sets the boolean and also switches the picker
view to be hidden or not, depending on if the view is already visible:

{% highlight objc %}
- (IBAction)typeButtonTouched:(id)sender
{
    [self dismissKeyboard];
    typePickerShouldOpen = !typePickerShouldOpen;

    [self.tableView beginUpdates];
    if (typePickerShouldOpen) {
        self.tripTypePicker.hidden = NO;
    } else {
        self.tripTypePicker.hidden = YES;
    }
    [self.tableView endUpdates];

    [self.tripTypePicker selectRow:[_typeOptions indexOfObject:[_typeButton.titleLabel.text stringByTrimmingCharactersInSet:[NSCharacterSet whitespaceAndNewlineCharacterSet]]] inComponent:0 animated:YES];
}
{% endhighlight %}

You throw this in between beginUpdates and enUpdates. This causes the table to re-render, which in turn triggers the
height to be checked. We'll take advantage of this to change the height of the table cell that contains the picker
view:
{% highlight objc %}
- (CGFloat)tableView:(UITableView *)tableView heightForRowAtIndexPath:(NSIndexPath *)indexPath {
    if (indexPath.section == 0 && indexPath.row == 3) { // this is my picker cell
        if (typePickerShouldOpen) {
            return 219;
        } else {
            return 0;
        }
    } else {
        return self.tableView.rowHeight;
    }
}
{% endhighlight %}

And that's it!
