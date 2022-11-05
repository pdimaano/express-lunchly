"use strict";

/** Reservation for Lunchly */

const moment = require("moment");

const db = require("../db");

/** A reservation for a party */

class Reservation {
  constructor({ id, customerId, numGuests, startAt, notes }) {
    this.id = id;
    this.customerId = customerId;
    this.numGuests = numGuests;
    this.startAt = startAt;
    this.notes = notes;
  }

  /** formatter for startAt */

  getFormattedStartAt() {
    return moment(this.startAt).format("MMMM Do YYYY, h:mm a");
  }

  /** given a customer id, find their reservations. */

  static async getReservationsForCustomer(customerId) {
    const results = await db.query(
      `SELECT id,
                  customer_id AS "customerId",
                  num_guests AS "numGuests",
                  start_at AS "startAt",
                  notes AS "notes"
           FROM reservations
           WHERE customer_id = $1`,
      [customerId]
    );

    return results.rows.map((row) => new Reservation(row));
  }

  /** save this reservation. */
  async save() {
    if (this.id === undefined) {
      const result = await db.query(
        `INSERT INTO reservations (customer_id, start_at, num_guests, notes)
             VALUES ($1, $2, $3, $4)
             RETURNING id`,
        [this.customerId, this.startAt, this.numGuests, this.notes]
      );
      this.id = result.rows[0].id;
    } else {
      await db.query(
        `UPDATE reservations
               SET customer_id=$1,
                   start_at=$2,
                   num_guests=$3,
                   notes=$4
               WHERE id = $5`,
        [this.customerId, this.startAt, this.numGuests, this.notes]
      );
    }
  }

  /** Get number of guests for a reservation. If the number of guests is
   *  less than one, throw an error.
   */

  get numGuests() {
    return this._numGuests;
  }

  set numGuests(val) {
    if (val < 1)
      throw new Error("Number of guests must be greater than one person.");
    this._numGuests = val;
  }

  /** Get start date and time for a reservation. If the value is not a Date
   *  object, throw an error.
   */

  get startAt() {
    // debugger
    return this._startAt;
  }

  set startAt(val) {
    debugger
    //! If val.toString() === "Invalid Date"
    if (val instanceof Date === false)
      throw new Error("Value must be a valid date and time.");
    this._startAt = val;
  }
}

module.exports = Reservation;
