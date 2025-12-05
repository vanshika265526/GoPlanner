import jsPDF from 'jspdf';

/**
 * Generate and download PDF for itinerary plan with enhanced design
 */
export const downloadItineraryPDF = (itinerary) => {
  try {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    const margin = 20;
    const lineHeight = 7;
    const maxWidth = pageWidth - 2 * margin;
    const primaryColor = [19, 127, 236]; // Primary blue color
    const lightGray = [240, 240, 240];
    const darkGray = [100, 100, 100];

    // Helper function to add new page if needed
    const checkNewPage = (requiredSpace = 20) => {
      if (yPosition + requiredSpace > pageHeight - margin - 15) {
        doc.addPage();
        yPosition = 20;
        return true;
      }
      return false;
    };

    // Helper function to draw rounded rectangle
    const drawRoundedRect = (x, y, width, height, radius = 3) => {
      doc.setLineWidth(0.5);
      doc.setDrawColor(...primaryColor);
      doc.roundedRect(x, y, width, height, radius, radius);
    };

    // Helper function to draw filled box
    const drawFilledBox = (x, y, width, height, color = primaryColor) => {
      doc.setFillColor(...color);
      doc.roundedRect(x, y, width, height, 2, 2, 'F');
    };

    // Header with colored background
    doc.setFillColor(...primaryColor);
    doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 35, 3, 3, 'F');
    
    // Title in header
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('GoPlanner', margin + 10, yPosition + 12);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Trip Itinerary', margin + 10, yPosition + 22);
    
    yPosition += 45;

    // Trip Information Box
    checkNewPage(50);
    const infoBoxHeight = itinerary.interests && itinerary.interests.length > 0 ? 50 : 40;
    drawRoundedRect(margin, yPosition, pageWidth - 2 * margin, infoBoxHeight, 4);
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    
    let infoX = margin + 8;
    let infoY = yPosition + 8;
    
    if (itinerary.destination) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Destination:', infoX, infoY);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(itinerary.destination, infoX + 45, infoY);
      infoY += 8;
    }
    
    if (itinerary.startDate && itinerary.endDate) {
      const startDate = new Date(itinerary.startDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      const endDate = new Date(itinerary.endDate).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Travel Dates:', infoX, infoY);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(`${startDate} - ${endDate}`, infoX + 45, infoY);
      infoY += 8;
    }
    
    if (itinerary.budget) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Budget:', infoX, infoY);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(itinerary.budget, infoX + 45, infoY);
    }

    if (itinerary.interests && itinerary.interests.length > 0) {
      infoY += 8;
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...primaryColor);
      doc.text('Interests:', infoX, infoY);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0, 0, 0);
      doc.text(itinerary.interests.join(', '), infoX + 45, infoY);
    }

    yPosition += infoBoxHeight + 10;

    // Days and activities
    const days = itinerary.days || itinerary.itinerary || [];
    
    days.forEach((day, dayIndex) => {
      checkNewPage(50);
      
      // Day header with colored background
      doc.setFillColor(...primaryColor);
      doc.roundedRect(margin, yPosition, pageWidth - 2 * margin, 12, 3, 3, 'F');
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      
      const dayNumber = day.dayNumber || dayIndex + 1;
      let dayText = `Day ${dayNumber}`;
      
      if (day.theme) {
        dayText += ` • ${day.theme}`;
      }
      
      if (day.date) {
        const dateStr = new Date(day.date).toLocaleDateString('en-US', { 
          weekday: 'short',
          month: 'short', 
          day: 'numeric' 
        });
        dayText += ` (${dateStr})`;
      }
      
      doc.text(dayText, margin + 8, yPosition + 8);
      yPosition += 18;

      // Activities
      const activities = day.activities || [];
      
      if (activities.length === 0) {
        doc.setTextColor(...darkGray);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'italic');
        doc.text('No activities scheduled for this day.', margin + 10, yPosition);
        yPosition += 10;
      } else {
        activities.forEach((activity, actIndex) => {
          checkNewPage(25);

          // Activity box with light background
          const activityBoxHeight = 28;
          doc.setFillColor(...lightGray);
          doc.roundedRect(margin + 5, yPosition, pageWidth - 2 * margin - 10, activityBoxHeight, 2, 2, 'F');
          
          // Time badge
          if (activity.time) {
            doc.setFillColor(...primaryColor);
            doc.roundedRect(margin + 8, yPosition + 3, 35, 6, 2, 2, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(10);
            doc.setFont('helvetica', 'bold');
            doc.text(activity.time, margin + 10, yPosition + 7);
          }

          // Activity name
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const activityName = activity.activity || activity.name || 'Activity';
          const activityX = activity.time ? margin + 50 : margin + 12;
          doc.text(activityName, activityX, yPosition + 7);

          // Location
          if (activity.location) {
            doc.setFontSize(10);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(...darkGray);
            doc.text(`Location: ${activity.location}`, activityX, yPosition + 14);
          }

          // Description/Notes
          if (activity.notes || activity.description) {
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(60, 60, 60);
            const notes = (activity.notes || activity.description || '');
            const splitNotes = doc.splitTextToSize(notes, maxWidth - 60);
            doc.text(splitNotes, activityX, yPosition + 20);
            yPosition += splitNotes.length * 4;
          }

          yPosition += activityBoxHeight + 5;
        });
      }

      yPosition += 8;
    });

    // Footer on all pages
    const totalPages = doc.internal.pages.length - 1;
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      
      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Footer text
      doc.setFontSize(8);
      doc.setTextColor(...darkGray);
      doc.text(
        `Generated by GoPlanner • Page ${i} of ${totalPages} • ${new Date().toLocaleDateString()}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
    }

    // Download PDF
    const destinationName = (itinerary.destination || 'Trip').replace(/[^a-z0-9]/gi, '_');
    const fileName = `GoPlanner_${destinationName}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(fileName);
    
    return { success: true };
  } catch (error) {
    console.error('Error generating PDF:', error);
    return { success: false, error: error.message };
  }
};
